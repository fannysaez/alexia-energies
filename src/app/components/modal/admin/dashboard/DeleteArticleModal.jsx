
import React from 'react';
import Modal from '../../modal';
import styles from './deleteArticleModal.module.css';

export default function DeleteArticleModal({ isOpen, onClose, onConfirm, article }) {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className={styles.modalContent}>
                <h2 className={styles.title}>Supprimer un article</h2>
                <p className={styles.text}>
                    Voulez-vous vraiment supprimer l'article&nbsp;
                    <strong className={styles.highlight}>{article?.title}</strong> ?
                </p>
                <div className={styles.actions}>
                    <button onClick={onClose} className={styles.cancelBtn} aria-label="Annuler la suppression de l'article">Annuler</button>
                    <button onClick={onConfirm} className={styles.confirmBtn} aria-label="Confirmer la suppression de l'article">Confirmer</button>
                </div>
            </div>
        </Modal>
    );
}
