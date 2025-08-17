"use client";
import React, { useEffect, useState } from 'react';
import styles from './newsletter.module.css';
import { FaEye, FaRegEdit, FaRegTrashAlt } from 'react-icons/fa';

const NewsletterAdmin = () => {
    const [inscriptions, setInscriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showViewModal, setShowViewModal] = useState(false);
    const [viewItem, setViewItem] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editItem, setEditItem] = useState(null);
    const [editEmail, setEditEmail] = useState('');
    const [editError, setEditError] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteItem, setDeleteItem] = useState(null);

    const fetchInscriptions = () => {
        setLoading(true);
        fetch('/api/admin/newsletter')
            .then(async (res) => {
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || 'Erreur serveur');
                setInscriptions(data.inscriptions);
            })
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchInscriptions();
    }, []);
    const handleEdit = (item) => {
        setEditItem(item);
        setEditEmail(item.email);
        setEditError('');
        setShowEditModal(true);
    };

    const closeEditModal = () => {
        setShowEditModal(false);
        setEditItem(null);
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        setEditError('');
        try {
            const res = await fetch(`/api/admin/newsletter/${editItem.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: editEmail })
            });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Erreur lors de la modification');
            }
            setShowEditModal(false);
            fetchInscriptions();
        } catch (e) {
            setEditError(e.message);
        }
    };

    const handleDelete = (item) => {
        setDeleteItem(item);
        setShowDeleteModal(true);
    };

    const closeDeleteModal = () => {
        setShowDeleteModal(false);
        setDeleteItem(null);
    };

    const confirmDelete = async () => {
        if (!deleteItem) return;
        try {
            const res = await fetch(`/api/admin/newsletter/${deleteItem.id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Erreur lors de la suppression');
            closeDeleteModal();
            fetchInscriptions();
        } catch (e) {
            alert(e.message);
        }
    };

    const handleView = (item) => {
        setViewItem(item);
        setShowViewModal(true);
    };

    const closeViewModal = () => {
        setShowViewModal(false);
        setViewItem(null);
    };

    return (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '60vh', justifyContent: 'flex-start' }}>
            <h1
                style={{
                    color: '#F7C59F',
                    fontFamily: 'SortsMillGoudy-Regular, serif',
                    fontSize: '2.2rem',
                    fontWeight: 400,
                    letterSpacing: '0.02em',
                    textAlign: 'center',
                    lineHeight: 1.1,
                    textShadow: '0 1px 8px #0002',
                }}
            >
                Gestion des Inscriptions
            </h1>
            {/* Séparateur largeur bloc principal */}
            <div style={{
                width: '100%',
                borderBottom: '1.5px solid var(--decorative-line-color, #F7C59F)',
                margin: '18px 0 36px 0',
            }} />
            <div className={styles.cardContainer}>
                <h2 style={{ color: '#F7C59F', fontFamily: 'SortsMillGoudy-Regular, serif', fontSize: '1.5rem', marginBottom: 18, textAlign: 'center' }}>
                    Inscriptions à la newsletter
                </h2>
                {loading && <p style={{ color: '#FFD9A0', textAlign: 'center' }}>Chargement...</p>}
                {error && <p style={{ color: 'red', textAlign: 'center', marginBottom: 12 }}>{error}</p>}
                {!loading && !error && (
                    <div style={{ width: '100%' }}>

                        <table
                            className={`admin-table-responsive ${styles.newsletterTable}`}
                        >
                            <thead>
                                <tr className={styles.tableHeadRow}>
                                    <th className={styles.thLeft}>Email</th>
                                    <th className={styles.thLeft}>Date d'inscription</th>
                                    <th className={styles.thCenter}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {inscriptions.length === 0 && (
                                    <tr>
                                        <td colSpan={3} className={styles.noNewsletterCell}>Aucune inscription</td>
                                    </tr>
                                )}
                                {inscriptions.map((item) => (
                                    <tr key={item.id} className={styles.cardRow}>
                                        <td data-label="Email" className={styles.tdCell}>{item.email}</td>
                                        <td data-label="Date d'inscription" className={styles.tdCell}>{new Date(item.dateInscription).toLocaleString('fr-FR')}</td>
                                        <td data-label="Actions" className={styles.actionsCell}>
                                            <FaEye style={{ color: '#1bac0eff', fontSize: 18, marginRight: 10, verticalAlign: 'middle', cursor: 'pointer' }} onClick={() => handleView(item)} title="Voir" />
                                            <FaRegEdit style={{ color: '#0e4dacff', fontSize: 18, marginRight: 10, verticalAlign: 'middle', cursor: 'pointer', opacity: 1 }} onClick={() => handleEdit(item)} title="Éditer" />
                                            <FaRegTrashAlt style={{ color: '#ac0e20ff', fontSize: 18, verticalAlign: 'middle', cursor: 'pointer', opacity: 1 }} onClick={() => handleDelete(item)} title="Supprimer" />
                                            {/* Modal Supprimer */}
                                            {showDeleteModal && deleteItem && (
                                                <div className={styles.modalOverlay}>
                                                    <div className={styles.modalBox}>
                                                        <h3 className={styles.modalDeleteTitle}>Supprimer l'inscription</h3>
                                                        <div className={styles.modalDeleteText}>
                                                            Êtes-vous sûr de vouloir supprimer l'inscription de&nbsp;
                                                            <strong>{deleteItem.email}</strong> ?
                                                        </div>
                                                        <div className={styles.modalDeleteActions}>
                                                            <button type="button" onClick={closeDeleteModal} className={styles.btnCancel}>Annuler</button>
                                                            <button type="button" onClick={confirmDelete} className={styles.btnDelete}>Supprimer</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {/* Modal Voir */}
                        {showViewModal && viewItem && (
                            <div className={styles.modalOverlay}>
                                <div className={styles.modalBox}>
                                    <h3 className={styles.modalViewTitle}>Détail inscription</h3>
                                    <div className={styles.modalViewText}><strong>Email :</strong> {viewItem.email}</div>
                                    <div className={styles.modalViewText}><strong>Date d'inscription :</strong> {new Date(viewItem.dateInscription).toLocaleString('fr-FR')}</div>
                                    <div className={styles.modalViewActions}>
                                        <button type="button" onClick={closeViewModal} className={styles.btnClose}>Fermer</button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Modal Editer */}
                        {showEditModal && editItem && (
                            <div className={styles.modalOverlay}>
                                <div className={styles.modalBox}>
                                    <h3 className={styles.modalEditTitle}>Modifier l'inscription</h3>
                                    <form onSubmit={handleEditSubmit}>
                                        <div className={styles.modalEditField}>
                                            <label className={styles.modalEditLabel}>Email</label>
                                            <input type="email" value={editEmail} onChange={e => setEditEmail(e.target.value)} required className={styles.modalEditInput} />
                                        </div>
                                        {editError && <div className={styles.modalEditError}>{editError}</div>}
                                        <div className={styles.modalEditActions}>
                                            <button type="button" onClick={closeEditModal} className={styles.btnCancel}>Annuler</button>
                                            <button type="submit" className={styles.btnSave}>Enregistrer</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default NewsletterAdmin;
