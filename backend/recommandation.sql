-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le : mer. 10 jan. 2024 à 16:36
-- Version du serveur : 8.2.0
-- Version de PHP : 8.2.13

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `recommandation`
--

-- --------------------------------------------------------

--
-- Structure de la table `agence`
--

DROP TABLE IF EXISTS `agence`;
CREATE TABLE IF NOT EXISTS `agence` (
  `agence_Id` int NOT NULL AUTO_INCREMENT,
  `Agence_nom` varchar(20) NOT NULL,
  `Agence_code` varchar(20) NOT NULL,
  PRIMARY KEY (`agence_Id`)
) ENGINE=MyISAM AUTO_INCREMENT=40 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `agence`
--

INSERT INTO `agence` (`agence_Id`, `Agence_nom`, `Agence_code`) VALUES
(1, 'BOA', '207'),
(2, 'BFVSG', '206'),
(39, 'BMOI', '209');

-- --------------------------------------------------------

--
-- Structure de la table `béneficiaire`
--

DROP TABLE IF EXISTS `béneficiaire`;
CREATE TABLE IF NOT EXISTS `béneficiaire` (
  `Ben_id` int NOT NULL AUTO_INCREMENT,
  `Grp_code` varchar(40) NOT NULL,
  `Ben_Nom` varchar(40) NOT NULL,
  `Ben_Addresse` varchar(40) NOT NULL,
  `Ben_code` varchar(40) NOT NULL,
  `Agence_nom` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`Ben_id`)
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `béneficiaire`
--

INSERT INTO `béneficiaire` (`Ben_id`, `Grp_code`, `Ben_Nom`, `Ben_Addresse`, `Ben_code`, `Agence_nom`) VALUES
(1, '200', 'Veldra', 'Antanimena', '4499', ''),
(2, '206', 'Fitahina', 'Antanimena', '4499', ''),
(3, '209', 'Millim', 'Antanimena', '4499', '');

-- --------------------------------------------------------

--
-- Structure de la table `envoi`
--

DROP TABLE IF EXISTS `envoi`;
CREATE TABLE IF NOT EXISTS `envoi` (
  `Env_id` int NOT NULL AUTO_INCREMENT,
  `Env_num` varchar(255) NOT NULL,
  `Env_poids` int NOT NULL,
  `Env_taxe` int NOT NULL,
  `Env_date_depot` varchar(255) NOT NULL,
  `Env_agence_depot` varchar(255) NOT NULL,
  `Env_exp` varchar(255) NOT NULL,
  `Env_dest` varchar(255) NOT NULL,
  PRIMARY KEY (`Env_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `envoi`
--

INSERT INTO `envoi` (`Env_id`, `Env_num`, `Env_poids`, `Env_taxe`, `Env_date_depot`, `Env_agence_depot`, `Env_exp`, `Env_dest`) VALUES
(7, '1', 15, 500, '2024-01-10', 'BOA', 'Veldra', 'Veldra'),
(8, '', 0, 0, '2024-01-10', 'BOA', 'Veldra', 'Veldra'),
(9, '20', 15, 1000, '2024-01-10', 'BFVSG', 'Fitahina', 'Veldra'),
(10, '1', 15, 20, '2024-01-10', 'BMOI', 'Millim', 'Veldra');

-- --------------------------------------------------------

--
-- Structure de la table `fonction`
--

DROP TABLE IF EXISTS `fonction`;
CREATE TABLE IF NOT EXISTS `fonction` (
  `Fo_id` int NOT NULL AUTO_INCREMENT,
  `Fo_nom` varchar(255) NOT NULL,
  PRIMARY KEY (`Fo_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `fonction`
--

INSERT INTO `fonction` (`Fo_id`, `Fo_nom`) VALUES
(1, 'admin'),
(3, 'saisie'),
(4, 'Vérification');

-- --------------------------------------------------------

--
-- Structure de la table `groupement`
--

DROP TABLE IF EXISTS `groupement`;
CREATE TABLE IF NOT EXISTS `groupement` (
  `Grp_id` int NOT NULL AUTO_INCREMENT,
  `Grp_nom` varchar(255) NOT NULL,
  `Grp_code` varchar(255) NOT NULL,
  `Grp_adresse` varchar(255) NOT NULL,
  `Grp_responsable` varchar(255) NOT NULL,
  `Grp_contact` varchar(17) NOT NULL,
  `Grp_type` varchar(255) NOT NULL,
  `Grp_mail` varchar(45) NOT NULL,
  PRIMARY KEY (`Grp_id`)
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `groupement`
--

INSERT INTO `groupement` (`Grp_id`, `Grp_nom`, `Grp_code`, `Grp_adresse`, `Grp_responsable`, `Grp_contact`, `Grp_type`, `Grp_mail`) VALUES
(35, 'BOA', '200', 'Antaninarenina', 'DG', '0349559225', 'bank', ''),
(36, 'BlaBla', '206', 'Ampitatafika', 'DSI', '034656153', 'Bank', ''),
(37, 'HIaka', '209', 'Ampitatafika', '206', '2602', 'banque', '');

-- --------------------------------------------------------

--
-- Structure de la table `utilisateur`
--

DROP TABLE IF EXISTS `utilisateur`;
CREATE TABLE IF NOT EXISTS `utilisateur` (
  `Us_id` int NOT NULL AUTO_INCREMENT,
  `Us_nom` varchar(255) NOT NULL,
  `Us_matricule` varchar(255) NOT NULL,
  `Us_login` varchar(255) NOT NULL,
  `Us_mail` varchar(255) NOT NULL,
  `Us_pwd` varchar(11) NOT NULL,
  `Fo_id` int NOT NULL,
  `Grp_id` int NOT NULL,
  PRIMARY KEY (`Us_id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `utilisateur`
--

INSERT INTO `utilisateur` (`Us_id`, `Us_nom`, `Us_matricule`, `Us_login`, `Us_mail`, `Us_pwd`, `Fo_id`, `Grp_id`) VALUES
(12, 'fitahiana', '2265', 'Fitahiana', 'fitahiana@gmail.com', 'admin', 1, 404),
(15, 'Dimbiniaina', '4499', 'Dimby', 'fitahiana.dimbiniana@gmail.com', '123456', 1, 265),
(16, 'Razafimahatratra', '4562', 'NekrozX4', 'dimbiniaina.fitahiana@gmail.com', '123456', 1, 205),
(17, 'Velonarivo', '4562', 'Vony', 'vony', '123456', 2, 256),
(19, 'mams', '99', 'mams', 'mamsgit', '123556', 2, 206),
(20, 'Razafimahatratra', '2245', 'Veldra', 'dimbiniaina.fitahiana@gmail.com', 'admin', 1, 206),
(21, 'Veldra Tempest', '4415', 'Rimuru', 'Millim', 'admin', 1, 2206);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
