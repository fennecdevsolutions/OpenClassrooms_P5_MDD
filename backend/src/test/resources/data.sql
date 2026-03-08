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
('Abdel_Dev', 'abdel@mdd.com', '$2a$10$e0MYzXyjpJS7Pd0RVvHwHeasBC26251z/5IxG'), 
('Sophie_Code', 'sophie@mdd.com', '$2a$10$e0MYzXyjpJS7Pd0RVvHwHeasBC26251z/5IxG'),
('Jean_Test', 'jean@mdd.com', '$2a$10$e0MYzXyjpJS7Pd0RVvHwHeasBC26251z/5IxG');

INSERT INTO themes (id, title, description) VALUES 
(1, 'Java', 'Discussions autour de l’écosystème Java et Spring Boot.'),
(2, 'Angular', 'Tout sur le framework Angular et le développement Front-end.'),
(3, 'Architecture', 'Bonnes pratiques, design patterns et schémas globaux.');

INSERT INTO articles (title, content, author_id, theme_id) VALUES 
('Introduction à Spring Boot', 'Spring Boot simplifie la configuration des applications Java via l''IoC.', 1, 1),
('Les nouveautés d''Angular 21', 'Cette version améliore la réactivité et la gestion des signaux.', 2, 2),
('Pourquoi utiliser MySQL ?', 'C''est un choix robuste pour gérer des relations complexes entre entités.', 1, 3);

INSERT INTO comments (content, article_id, author_id) VALUES 
('Super article, très clair !', 1, 2),
('J''ai hâte de tester ces nouveautés sur mon prochain projet.', 2, 1),
('Est-ce que InnoDB est activé par défaut ?', 3, 3);

INSERT INTO subscriptions (user_id, theme_id) VALUES 
(1, 1), -- Abdel est abonné à Java
(1, 2), -- Abdel est abonné à Angular
(2, 2); -- Sophie est abonnée à Angular


