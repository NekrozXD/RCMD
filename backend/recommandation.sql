-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le : sam. 03 fév. 2024 à 14:01
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
) ENGINE=MyISAM AUTO_INCREMENT=45 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `agence`
--

INSERT INTO `agence` (`agence_Id`, `Agence_nom`, `Agence_code`) VALUES
(44, 'BFV', '209'),
(43, 'Paositra', '210');

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
) ENGINE=MyISAM AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `béneficiaire`
--

INSERT INTO `béneficiaire` (`Ben_id`, `Grp_code`, `Ben_Nom`, `Ben_Addresse`, `Ben_code`, `Agence_nom`) VALUES
(1, '210', 'Fitahina', 'Ambohibao', '4499', ''),
(2, '210', 'Fitahina', 'Ambohibao', '4499', ''),
(3, '210', 'Fitahina', 'Ambohibao', '4499', ''),
(4, '210', 'Fitahina', 'Ambohibao', '4499', ''),
(5, '209', 'fita', 'Moramanga', '2265', ''),
(6, '209', 'Nekroz', 'Moramena', '2266', ''),
(7, '209', 'Ariana Grande', 'Moramavo', '2267', ''),
(8, '209', 'Lil Pump', 'Moramanga', '2268', ''),
(9, '209', 'Travis Scoot', 'Moramena', '2269', ''),
(10, '209', 'Bts Juncock', 'Moramavo', '2270', ''),
(11, '209', 'Lisa', 'Moramanga', '2271', ''),
(12, '209', 'Jesus', 'Moramena', '2272', ''),
(13, '209', 'Jenny', 'Moramavo', '2273', ''),
(14, '209', 'Jenifer ', 'Moramanga', '2274', ''),
(15, '209', 'Lopez', 'Moramena', '2275', ''),
(16, '209', 'Dicaprio', 'Moramavo', '2276', ''),
(17, '209', 'Da vinci', 'Moramanga', '2277', ''),
(18, '209', 'Mia Khalifa', 'Moramena', '2278', ''),
(19, '209', 'Jhonny Sins', 'Moramavo', '2279', ''),
(20, '209', 'Tsisy inspi tsony', 'Moramora', '2280', ''),
(21, '209', 'Nom de famillle ny prenom lava BE', 'Ivandry', '12354', '');

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
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `envoi`
--

INSERT INTO `envoi` (`Env_id`, `Env_num`, `Env_poids`, `Env_taxe`, `Env_date_depot`, `Env_agence_depot`, `Env_exp`, `Env_dest`) VALUES
(1, '400', 10, 450, '2024-02-03', 'BFV', 'Jenny', 'Lisa'),
(2, '100', 15, 10, '2024-02-03', 'BFV', 'Lopez', 'Lisa'),
(3, '152Bis458', 15, 10, '2024-02-03', 'BFV', 'Lisa', 'Jenny'),
(4, '200', 15, 1000, '2024-02-03', 'BFV', 'Nom de famillle ny prenom lava BE', 'Jenny');

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
) ENGINE=InnoDB AUTO_INCREMENT=46 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `groupement`
--

INSERT INTO `groupement` (`Grp_id`, `Grp_nom`, `Grp_code`, `Grp_adresse`, `Grp_responsable`, `Grp_contact`, `Grp_type`, `Grp_mail`) VALUES
(35, 'BOA', '210', 'Antaninarenina', 'DG', '0349559225', 'bank', 'boa@contact.mg'),
(37, 'HIaka', '209', 'Ampitatafika', 'DG hiaka', '2602', 'Societe', 'Hiaka@contact.mg');

-- --------------------------------------------------------

--
-- Structure de la table `historique`
--

DROP TABLE IF EXISTS `historique`;
CREATE TABLE IF NOT EXISTS `historique` (
  `HIst_id` int NOT NULL AUTO_INCREMENT,
  `Env_num` varchar(20) NOT NULL,
  `HIst_evenement` varchar(20) NOT NULL,
  `HIst_date` varchar(20) NOT NULL,
  `Hist_etat` varchar(20) NOT NULL,
  `Hist_agence` varchar(20) NOT NULL,
  PRIMARY KEY (`HIst_id`)
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `historique`
--

INSERT INTO `historique` (`HIst_id`, `Env_num`, `HIst_evenement`, `HIst_date`, `Hist_etat`, `Hist_agence`) VALUES
(1, '400', 'EMA', '2024-02-03', '1', 'BFV'),
(2, '100', 'EMG', '2024-02-03', '1', 'BFV'),
(3, '152Bis458', 'EMG', '2024-02-03', '1', 'BFV'),
(4, '200', 'ETA', '2024-02-03', '1', 'BFV');

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
  `Grp_code` int NOT NULL,
  `profile_picture_path` varchar(255) NOT NULL,
  PRIMARY KEY (`Us_id`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `utilisateur`
--

INSERT INTO `utilisateur` (`Us_id`, `Us_nom`, `Us_matricule`, `Us_login`, `Us_mail`, `Us_pwd`, `Fo_id`, `Grp_code`, `profile_picture_path`) VALUES
(12, ' Razafimahatratra fitahiana', '2265', 'Fitahiana', 'fitahiana@gmail.com', 'admin', 1, 210, ''),
(22, 'Millim Nava', '5689', 'Veldra', 'admin beuh', 'admin', 1, 209, ''),
(23, 'saisie', '449945', 'saisie', 'fitahiana.dimbiniaina@gmail.com', 'saisie', 2, 209, '');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
