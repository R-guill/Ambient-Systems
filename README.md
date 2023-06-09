# Ambient-Systems


## Backend
On a utilisé un modèle de detection de piétons pre-entraîné de la bibliotheque OpenCV. Tous les 5 secondes on processe l'image transmi pour la camera à profondeur. Pour chaque piéton indentifie
on dessigne une boite qui les entoure.

Pour le backend on utilise un client MQTT de Python fourni par la bibliotheque Paho.  On a trois scrypts de Python :
<ul>
  <li>Le fichier <em> python/mqtt_publisher.py </em> contient les fonctions necesaires pour se connecter à un broker publique de EMQX, un fourniseur de services MQTT cloud, en plus, si on tourne le script, il va faire un test en publiant un nombre de personnes constant tous les 5 secondes</li> 
 <li>Le fichier <em> python/mqtt_subscriber.py </em> s'abonne au topic "CoffeeRush/AddWaitingTime" pour récevoir les registres de temps réels envoyes par les utilisateurs de l'application. à chaque reception d'un registre, il l'ajoute au fichier time_estimation_data.npy le temps estimée es la moyenne de tous les donnes enregistrées.</li>
 <li>Le fichier <em> python/stream_n_persons.py </em> se connecte à la camera à profondeur, traite les images et publie surs les topics "CoffeeRush/NPersons" et "CoffeeRush/WaitingTime" le nombre actuel de personnes dans la machine a cafe et l'estimation de temps d'attente. Il affiche aussi le stream de video fourni par la camera avec les piétons identifies. </li>
</ul>

Pour lancer le backend, il suffit de tourner les scripts <em> python/mqtt_subscriber.py </em> et <em> python/stream_n_persons.py </em>, chacun dans une terminale differente.
  
## Frontend
Le frontend est développé en React Native et Javascript. A cause de problème de compatibilité de modules, nous n'avons pas pu générer le fichier APK de l'application. Pour avoir le résultat, il faut exécuter en mode développement avec npx expo start par exemple. L'application est consitué de deux écrans : l'accueil et le timer. Sur la page d'acceuil, on lit le nombre de personnes présentes et le temps d'attente estimé et on peut demander une alarme quand il n'y a plus personne dans la queue, qui fera vibrer le téléphone.
On a aussi la possibilité d'ouvrir la page du timer qui permet de chronométrer son temps d'attente à la machine à café et qui envoie le temps d'attente réel et le temps d'attente au moment de l'activation du timer. Cela permet d'améliorer l'estimation du temps d'attente en moyennant les données reçues.

