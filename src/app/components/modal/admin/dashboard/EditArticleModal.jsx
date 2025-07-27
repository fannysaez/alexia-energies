
import React from 'react';
import Modal from '../../modal';
import styles from './editArticleModal.module.css';
import ArticleForm from '@/app/admin/articles/ArticleForm';

export default function EditArticleModal({ isOpen, onClose, onSave, article }) {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className={styles.modalContent}>
                <ArticleForm
                    mode="edit"
                    article={article}
                    onSuccess={onSave}
                    onCancel={onClose}
                />
            </div>
        </Modal>
    );
}
