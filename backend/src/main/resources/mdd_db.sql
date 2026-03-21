-- Creation de la base de données et connexion
CREATE DATABASE IF NOT EXISTS mdd_db;
USE mdd_db;
-- Creation de la table utilisateurs
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;
-- Creation de la table des thèmes
CREATE TABLE themes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;
-- Creation de la table des articles 
CREATE TABLE articles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    author_id BIGINT NOT NULL,
    theme_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_article_author FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_article_theme FOREIGN KEY (theme_id) REFERENCES themes(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Creation de la table des commentaires
CREATE TABLE comments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    content TEXT NOT NULL,
    article_id BIGINT NOT NULL,
    author_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_comment_article FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE,
    CONSTRAINT fk_comment_author FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Creation de la table de jointure pour gérer les abonnements
CREATE TABLE subscriptions (
    user_id BIGINT NOT NULL,
    theme_id BIGINT NOT NULL,
    subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, theme_id),
    CONSTRAINT fk_sub_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_sub_theme FOREIGN KEY (theme_id) REFERENCES themes(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Initial Data / Test Data (pwd: 'Password123!')
INSERT INTO users (username, email, password) VALUES 
('Abdel_Dev', 'abdel@mdd.com', '$2a$12$g3Z7FPiPs9bCahkfWo.i1eoaciZrgAjuDmQVk2OunubpTl/QZ83l6'), 
('Sophie_Code', 'sophie@mdd.com', '$2a$12$g3Z7FPiPs9bCahkfWo.i1eoaciZrgAjuDmQVk2OunubpTl/QZ83l6'),
('Jean_Test', 'jean@mdd.com', '$2a$12$g3Z7FPiPs9bCahkfWo.i1eoaciZrgAjuDmQVk2OunubpTl/QZ83l6');

INSERT INTO themes (id, title, description) VALUES 
(1, 'Java & Spring', 'Plongez dans l''écosystème Java moderne. Nous explorons ici les subtilités du framework Spring Boot, de la gestion de l''Inversion de Contrôle (IoC) à la sécurité avec Spring Security. Ce thème s''adresse aux développeurs backend souhaitant construire des microservices robustes, scalables et maintenables sur le long terme.'),
(2, 'Angular & TypeScript', 'Le développement frontend a évolué. Découvrez comment utiliser Angular pour créer des Single Page Applications (SPA) performantes. Nous discutons des Signals, de la détection de changement, de RxJS pour la programmation réactive, et des meilleures pratiques pour structurer vos composants et services de manière modulaire.'),
(3, 'Architecture & Design', 'L''architecture logicielle est l''art de prendre des décisions structurantes. Ce thème couvre les Design Patterns classiques (Gang of Four), l''architecture hexagonale, le Domain-Driven Design (DDD) et comment choisir entre monolithique et microservices en fonction des besoins métiers et techniques de votre projet.'),
(4, 'Bases de Données', 'La persistance des données est le cœur de toute application. Apprenez à optimiser vos requêtes SQL, à comprendre le fonctionnement du moteur InnoDB de MySQL, et à modéliser des relations complexes. Nous abordons également les compromis entre SQL et NoSQL pour les charges de travail intensives.'),
(5, 'DevOps & Cloud', 'Automatisez votre flux de travail. Du déploiement continu (CI/CD) avec GitHub Actions à la conteneurisation avec Docker et l''orchestration via Kubernetes. Ce thème explore comment rendre vos environnements de production plus résilients et comment monitorer vos applications en temps réel.');

INSERT INTO articles (title, content, author_id, theme_id) VALUES 
('La révolution des Signals en Angular', 'Angular a introduit les Signals pour transformer la façon dont nous gérons la réactivité. Contrairement à Zone.js qui vérifie tout l''arbre des composants, les Signals permettent une mise à jour granulaire. Cela signifie que seules les parties spécifiques du DOM qui dépendent d''une donnée changent. Imaginez une application complexe avec des milliers de composants ; le gain de performance est massif car nous évitons des cycles de détection de changement inutiles. Dans cet article, nous verrons comment migrer vos observables RxJS vers des Signals pour simplifier votre code et booster la fluidité de votre interface utilisateur.', 2, 2),
('Comprendre l''IoC dans Spring Boot', 'L''Inversion de Contrôle (IoC) est le pilier central de Spring. Au lieu que votre classe instancie ses propres dépendances, c''est le conteneur Spring qui les injecte. Cela favorise un couplage faible et facilite grandement les tests unitaires via le "mocking". En utilisant l''annotation @Service ou @Repository, vous déléguez la gestion du cycle de vie de vos objets à Spring. Nous allons explorer comment le BeanFactory et l''ApplicationContext travaillent ensemble pour scanner votre projet et assembler les pièces du puzzle automatiquement au démarrage de l''application.', 1, 1),
('Architecture Hexagonale : Pourquoi s''y mettre ?', 'L''architecture hexagonale, ou ports et adaptateurs, vise à isoler le code métier (le domaine) des préoccupations techniques comme la base de données ou les interfaces web. Le but est simple : votre logique métier ne doit pas dépendre d''un framework. Si vous décidez de passer de MySQL à MongoDB, ou de REST à GraphQL, votre cœur de métier reste inchangé. C''est la garantie d''une application qui ne vieillit pas prématurément. Nous analyserons les dossiers "domain", "application" et "infrastructure" pour comprendre la circulation des données à travers les interfaces.', 1, 3),
('Optimisation des index MySQL', 'Un index mal conçu peut ralentir votre application plus qu''il ne l''aide. Saviez-vous qu''un index B-Tree fonctionne différemment d''un index Hash ? Nous plongeons dans le moteur InnoDB pour comprendre comment les données sont stockées sur le disque. Nous verrons comment utiliser la commande EXPLAIN pour analyser vos requêtes lentes et déterminer si un index composite est nécessaire sur vos colonnes les plus filtrées. La performance de votre base de données est souvent le premier goulot d''étranglement d''une application web à fort trafic.', 3, 4),
('Dockeriser une application Angular et Spring', 'La conteneurisation permet d''assurer que votre application fonctionne exactement de la même manière sur votre machine de développement et en production. Dans ce guide complet, nous allons écrire un Dockerfile multi-stage pour Angular afin de servir les fichiers statiques via Nginx, et un autre pour Spring Boot utilisant une image JRE légère. Nous utiliserons Docker Compose pour orchestrer ces deux conteneurs et une base de données MySQL, créant ainsi un environnement complet prêt pour le déploiement en un seul clic.', 2, 5),
('Les flux asynchrones avec RxJS', 'RxJS est souvent considéré comme la partie la plus difficile d''Angular. Pourtant, maîtriser les opérateurs comme switchMap, mergeMap ou combineLatest est crucial pour gérer des flux de données complexes. Dans cet article très détaillé, nous prenons l''exemple d''une barre de recherche avec auto-complétion. Nous verrons comment debounceTime permet d''éviter d''envoyer une requête à chaque touche pressée, et comment distinctUntilChanged assure que nous ne relançons pas la même recherche deux fois.', 2, 2),
('Sécuriser ses API avec JWT', 'Le JSON Web Token (JWT) est devenu le standard pour l''authentification stateless dans les architectures modernes. Nous allons configurer Spring Security pour intercepter chaque requête, vérifier la signature du token et extraire les rôles de l''utilisateur. Nous aborderons également la problématique du rafraîchissement des tokens (Refresh Tokens) et comment stocker ces informations de manière sécurisée côté client pour éviter les failles XSS et CSRF.', 1, 1),
('Design Patterns : Le Singleton est-il un anti-pattern ?', 'Le Singleton assure qu''une classe n''a qu''une seule instance. Bien qu''utile, il est souvent critiqué car il introduit un état global caché et rend le code difficile à tester. Nous comparerons l''implémentation classique du Singleton en Java avec la gestion des beans Singleton native de Spring. Est-ce toujours pertinent en 2026 ?', 3, 3),
('Migration vers Java 21 : Les Virtual Threads', 'Java 21 apporte les Virtual Threads (Project Loom), une révolution pour la programmation concurrente. Contrairement aux threads classiques du système d''exploitation qui sont coûteux en mémoire, les threads virtuels sont légers et permettent de gérer des millions de connexions simultanées avec un code bloquant simple à lire. C''est la fin de la complexité du code asynchrone pour beaucoup d''applications backend.', 1, 1),
('CSS Grid vs Flexbox', 'Quand utiliser l''un plutôt que l''autre ? Flexbox est idéal pour les alignements sur un seul axe (ligne ou colonne), tandis que CSS Grid est conçu pour les mises en page bidimensionnelles complexes. Nous allons construire une interface de tableau de bord moderne en combinant les deux techniques pour obtenir le meilleur des deux mondes : la flexibilité et le contrôle total sur la grille.', 2, 2),
('Introduction au Clean Code', 'Le code est lu beaucoup plus souvent qu''il n''est écrit. S''appuyant sur les principes de Robert C. Martin, nous verrons comment nommer correctement nos variables, limiter la taille de nos fonctions et éviter les commentaires inutiles en rendant le code auto-explicatif. Un bon développeur écrit du code que les humains peuvent comprendre.', 1, 3),
('Normalisation vs Dénormalisation', 'En SQL, la normalisation (3NF) évite la redondance des données, mais elle multiplie les jointures coûteuses. Parfois, dénormaliser légèrement pour améliorer les performances de lecture est un choix pragmatique. Nous verrons des cas concrets où la duplication de données est acceptable pour garantir une expérience utilisateur fluide.', 3, 4),
('Introduction à Kubernetes', 'Si Docker permet de créer des conteneurs, Kubernetes permet de les gérer à grande échelle. Nous explorerons les concepts de Pods, Deployments et Services. Comment K8s gère-t-il l''auto-scaling quand le trafic augmente soudainement ? Et comment assure-t-il la haute disponibilité si un nœud du cluster tombe en panne ?', 2, 5),
('Gérer les erreurs dans Angular', 'Une application professionnelle ne doit pas planter silencieusement. Nous allons implémenter un Global Error Handler qui capture toutes les exceptions, les logue sur un service externe comme Sentry, et affiche un message compréhensible à l''utilisateur via une SnackBar Angular Material.', 2, 2),
('Tests d''intégration avec Testcontainers', 'Finis les mocks complexes pour vos bases de données. Testcontainers permet de lancer une véritable instance Docker de MySQL pendant vos tests JUnit. Cela garantit que votre code SQL et vos contraintes de clés étrangères fonctionnent réellement avant même de déployer en staging.', 1, 4);

INSERT INTO comments (content, article_id, author_id) VALUES 
('Excellente explication sur les Signals !', 1, 1),
('Je me demande si ça remplace totalement RxJS ?', 1, 3),
('Merci, j''avais du mal avec le concept d''IoC.', 2, 2),
('L''architecture hexagonale semble complexe pour des petits projets.', 3, 2),
('C''est vrai, mais la maintenabilité n''a pas de prix.', 3, 1),
('Très utile pour mon projet actuel, merci !', 3, 3),
('Docker est vraiment indispensable aujourd''hui.', 5, 1),
('RxJS est toujours aussi puissant pour les web sockets.', 6, 1),
('Les virtual threads vont changer ma vie au boulot !', 9, 2),
('Clean code est ma bible depuis 2 ans.', 11, 2);

INSERT INTO subscriptions (user_id, theme_id) VALUES 
(1, 1), (1, 2), (1, 3),
(2, 2), (2, 5),
(3, 4);

