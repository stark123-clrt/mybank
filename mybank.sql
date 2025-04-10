-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : jeu. 10 avr. 2025 à 17:52
-- Version du serveur : 10.4.32-MariaDB
-- Version de PHP : 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `mybank`
--

-- --------------------------------------------------------

--
-- Structure de la table `category`
--

CREATE TABLE `category` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `category`
--

INSERT INTO `category` (`id`, `user_id`, `title`, `created_at`, `updated_at`) VALUES
(6, 11, 'Nourriture', '2025-04-10 14:41:21', '2025-04-10 14:41:21'),
(7, 11, 'Ecole', '2025-04-10 14:41:35', '2025-04-10 14:41:35'),
(8, 11, 'Maison', '2025-04-10 14:41:45', '2025-04-10 14:41:45'),
(9, 12, 'Loyer', '2025-04-10 14:47:12', '2025-04-10 14:47:12'),
(10, 12, 'Course', '2025-04-10 16:22:02', '2025-04-10 16:22:02'),
(11, 13, 'Nourriture', '2025-04-10 16:56:46', '2025-04-10 16:56:46');

-- --------------------------------------------------------

--
-- Structure de la table `expense`
--

CREATE TABLE `expense` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `amount` int(11) NOT NULL COMMENT 'Montant en centimes',
  `date` date NOT NULL,
  `category_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `expense`
--

INSERT INTO `expense` (`id`, `title`, `amount`, `date`, `category_id`, `user_id`, `created_at`, `updated_at`) VALUES
(3, 'Loyer', 45000, '2025-04-10', 8, 11, '2025-04-10 14:42:14', '2025-04-10 14:42:14'),
(4, 'Maison', 45000, '2025-04-10', 9, 12, '2025-04-10 14:47:30', '2025-04-10 14:47:30'),
(5, 'moto', 40000, '2025-04-10', 7, 11, '2025-04-10 15:55:01', '2025-04-10 15:55:01'),
(6, 'Nourriture', 10000, '2025-04-10', 10, 12, '2025-04-10 16:22:29', '2025-04-10 16:22:29'),
(7, 'macdo', 20000, '2025-04-10', 11, 13, '2025-04-10 16:57:09', '2025-04-10 16:57:45');

-- --------------------------------------------------------

--
-- Structure de la table `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `email` varchar(180) NOT NULL,
  `password` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `user`
--

INSERT INTO `user` (`id`, `email`, `password`, `name`, `created_at`, `updated_at`) VALUES
(11, 'ondiyochristian10@gmail.com', '$2y$13$CYC/QUf7GWyTN2UZRl1Yc.MygATEAT/TBNFo1eKPn8zauXgmda1xu', 'ondiyo christian', '2025-04-10 14:12:45', '2025-04-10 14:12:45'),
(12, 'christianondiyo78@gmail.com', '$2y$13$tCMOG4MGGracCF1FLQ0noOgegVncj6r51P24XCIrl8YcQ6ELEVKfO', 'shako arnauld', '2025-04-10 14:14:15', '2025-04-10 14:14:15'),
(13, 'ondiyochristian12@gmail.com', '$2y$13$bro48T.ENFOOi/vzy2ZFmeea5QSKs6DCpqWqjF9Locu8hgjL4i.au', 'Liza NZINGA', '2025-04-10 16:50:30', '2025-04-10 16:50:30');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `category`
--
ALTER TABLE `category`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id_idx` (`user_id`);

--
-- Index pour la table `expense`
--
ALTER TABLE `expense`
  ADD PRIMARY KEY (`id`),
  ADD KEY `category_id_idx` (`category_id`),
  ADD KEY `user_id_idx` (`user_id`),
  ADD KEY `date_idx` (`date`);

--
-- Index pour la table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email_idx` (`email`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `category`
--
ALTER TABLE `category`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT pour la table `expense`
--
ALTER TABLE `expense`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT pour la table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `category`
--
ALTER TABLE `category`
  ADD CONSTRAINT `fk_category_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `expense`
--
ALTER TABLE `expense`
  ADD CONSTRAINT `fk_expense_category` FOREIGN KEY (`category_id`) REFERENCES `category` (`id`),
  ADD CONSTRAINT `fk_expense_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
