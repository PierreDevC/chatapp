# README.md — ChatApp

## Description du projet 

Une appli de chat en temps réel commme WhatsApp, avec un serveur Node.js et un frontemd React.
Tu peux créer des rooms, rejoindre celles existantes et discuter avec d'autres utilisateurs connectés en temps réel

---

## Question 1 - Analyse du code existant

### `server/server.js`
Le cerveau côté serveur. Il tourne avec Express + Socket.io et gère tout ce qui se passe en temps réel :
quand quelqu'un rejoint une room, envoie un message ou se déconnecte.
Il maintient aussi la liste des rooms en mémoire et la diffuse à tout le monde dès qu'il y a un changement.

### `client/src/context/SocketContext.js`
C'est ici qu'il y a la connexion Socket.io côté client. La connexion est créée une seule fois au
niveau du module (pas dans React). Un hook "useSocket()" permet à n'importe quel composant de récupérer 
le socket.

### `client/src/App.js`
Le composant racine.Il y a 3 usestate mais  il gère juste un état : est-ce que l'utilisateur est connecté ou pas ?
Si non, il affiche "Join" . Si oui, il affiche "Chat".

### `client/src/components/Join.js`
Cest' L'écran d'accueil. L'utilisateur entre son pseudo, voit la liste des rooms disponible en temps réel et peut en
rejoindre une ou en créer une nouvelle. Des qu'il clique sur une room avec un pseudo valide, il est redirigé vers le chat.

### `client/src/components/Chat.js`
C'est l'écran principal du chat. Il écoute les messages entrants via le socket, affiche les bulles, gère la saisie
et l'envoi des messages. Il affiche aussi le nombre de participants connectés dans la room.

### `client/src/components/Message.js`
Un petit composant qui affiche une seule bulle de message. Si c'est toi qui l'as envoyé, la bulle est à
droite en vert. Si c'est quelqu'un d'autre, elle est à gauche en blanc. 

### `client/src/components/Sidebar.js`
Le panneau latéral (le sidebar) qui liste les participants connectés dans la room. Il s'ouvre via le bouton hamburger
dans le header. Sur mobile il se superpose au chat, sur desktop il est toujours visible.


##  Question 2 - Communication frontend / backend

### Comment le socket est créé et partagé entre tous les composants React (indice : SocketContext.js).

Dans SocketContext.js, le socket est créé une seule fois au niveau du module, en dehors de React. 
Peu importe combien de composants l'importent, ils récupèrent tous le même objet. 
Il est ensuite mis dans un Context et accessible partout via useSocket(). Comme un peu un singleton.

### Quel évènement Socket.io est émis quand un utilisateur rejoint une room, et ce qui se passe cote serveur.

Quand l'utilisateur choisit une room, Join.js émet join_room avec le pseudo et le nom de la room. 
Côté serveur, server.js appelle socket.join(room) pour abonner ce socket au groupe, ajoute l'utilisateur en mémoire, 
envoie un message système à la room, met à jour la liste des participants pour la room et la liste des rooms pour tout le monde.

### Comment les messages sont diffusés à tous les membres d'une room (emit vs broadcast).

Quand un message est envoyé, le serveur fait io.to(room).emit() ce qui le redistribue à tous les membres de la room, expéditeur inclus. Le client n'ajoute donc jamais son propre message localement, il attend que le serveur le lui renvoie comme tout le monde.

socket.emit() envoie uniquement à ce client  
io.to(room).emit() envoie à tous les membres de la room  
io.emit() envoie à tous les clients connectés, utilisé pour mettre à jour la liste des rooms en temps réel