"use client";
import React, { useEffect, useState } from 'react';
// Hook pour détecter le mobile
function useIsMobile(breakpoint = 700) {
    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth <= breakpoint);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, [breakpoint]);
    return isMobile;
}
import styles from './users.module.css';
import { FaEye, FaRegEdit, FaRegTrashAlt } from 'react-icons/fa';

const UsersAdmin = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showEditModal, setShowEditModal] = useState(false);
    const [editUser, setEditUser] = useState(null);
    const [editEmail, setEditEmail] = useState('');
    const [editRole, setEditRole] = useState('user');
    const [modalError, setModalError] = useState('');
    const [showViewModal, setShowViewModal] = useState(false);
    const [viewUser, setViewUser] = useState(null);

    // Récupérer la liste fusionnée des utilisateurs (users + admins, sans doublons)
    const fetchUsers = () => {
        setLoading(true);
        fetch('/api/admin/users')
            .then(async (res) => {
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || 'Erreur serveur');
                setUsers(data.users);
            })
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // Handler pour ouvrir le modal d'édition
    const handleEdit = (user) => {
        setEditUser(user);
        setEditEmail(user.email);
        setEditRole(user.role);
        setModalError('');
        setShowEditModal(true);
    };

    // Gestion modale suppression utilisateur
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteUser, setDeleteUser] = useState(null);
    const [deleteError, setDeleteError] = useState('');

    const handleDelete = (user) => {
        setDeleteUser(user);
        setDeleteError('');
        setShowDeleteModal(true);
    };

    const closeDeleteModal = () => {
        setShowDeleteModal(false);
        setDeleteUser(null);
    };

    const confirmDelete = async () => {
        if (!deleteUser) return;
        setDeleteError('');
        try {
            const res = await fetch(`/api/admin/users/${deleteUser.id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Erreur lors de la suppression');
            closeDeleteModal();
            fetchUsers();
        } catch (e) {
            setDeleteError(e.message);
        }
    };

    // Handler pour voir (ici, simple alert, à personnaliser)
    const handleView = (user) => {
        setViewUser(user);
        setShowViewModal(true);
    };

    // Handler pour soumettre la modification
    const handleEditSubmit = async (e) => {
        e.preventDefault();
        setModalError('');
        try {
            const res = await fetch(`/api/admin/users/${editUser.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: editEmail, role: editRole })
            });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Erreur lors de la modification');
            }
            setShowEditModal(false);
            fetchUsers();
        } catch (e) {
            setModalError(e.message);
        }
    };

    // Handler pour fermer le modal
    const closeModal = () => {
        setShowEditModal(false);
        setEditUser(null);
    };

    const closeViewModal = () => {
        setShowViewModal(false);
        setViewUser(null);
    };

    const isMobile = useIsMobile();
    return (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '60vh', justifyContent: 'flex-start' }}>
            <h1 style={{ color: '#F7C59F', fontFamily: 'SortsMillGoudy-Regular, serif', fontSize: '2.2rem', fontWeight: 400, letterSpacing: '0.02em', textAlign: 'center', lineHeight: 1.1, textShadow: '0 1px 8px #0002' }}>
                Gestion des Utilisateurs
            </h1>
            <div style={{ width: '100%', borderBottom: '1.5px solid var(--decorative-line-color, #F7C59F)', margin: '18px 0 36px 0' }} />
            {/* ...suppression du bouton et de la modale Ajouter un utilisateur... */}
            <div className={styles.cardContainer}>
                <h2 style={{ color: '#F7C59F', fontFamily: 'SortsMillGoudy-Regular, serif', fontSize: '1.5rem', marginBottom: 18, textAlign: 'center' }}>
                    Liste des utilisateurs
                </h2>
                {loading && <p style={{ color: '#FFD9A0', textAlign: 'center' }}>Chargement...</p>}
                {error && <p style={{ color: 'red', textAlign: 'center', marginBottom: 12 }}>{error}</p>}
                {!loading && !error && (
                    <div style={{ width: '100%' }}>
                        {isMobile ? (
                            // Version mobile : cartes
                            <div>
                                {users.length === 0 && (
                                    <div className={styles.noUserCell}>Aucun utilisateur</div>
                                )}
                                {users.map((user) => (
                                    <div key={user.type + '-' + user.id} className={styles.cardRow} style={{ background: '#23201D', border: '1.5px solid #F7C59F', borderRadius: 12, marginBottom: 18, padding: 18 }}>
                                        <div className={styles.tdCell}><strong>Email :</strong> {user.email}</div>
                                        <div className={styles.tdCell}><strong>Prénom :</strong> {user.firstname || '-'}</div>
                                        <div className={styles.tdCell}><strong>Rôle :</strong> {user.role}</div>
                                        <div className={styles.actionsCell} style={{ marginTop: 10 }}>
                                            <span style={{ color: '#b48a5b', fontWeight: 600, marginRight: 8 }}>Actions :</span>
                                            <FaEye style={{ color: '#1bac0eff', fontSize: 18, marginRight: 10, verticalAlign: 'middle', cursor: 'pointer' }} title="Voir" onClick={() => handleView(user)} />
                                            <FaRegEdit style={{ color: '#0e4dacff', fontSize: 18, marginRight: 10, verticalAlign: 'middle', cursor: 'pointer', opacity: 1 }} title="Éditer" onClick={() => handleEdit(user)} />
                                            <FaRegTrashAlt style={{ color: '#ac0e20ff', fontSize: 18, verticalAlign: 'middle', cursor: 'pointer', opacity: 1 }} title="Supprimer" onClick={() => handleDelete(user)} />
                                            {/* Modal Supprimer */}
                                            {showDeleteModal && deleteUser && (
                                                <div className={styles.modalOverlay}>
                                                    <div className={styles.modalBox}>
                                                        <h3 className={styles.modalDeleteTitle}>Supprimer l'utilisateur</h3>
                                                        <div className={styles.modalDeleteText}>
                                                            Êtes-vous sûr de vouloir supprimer l'utilisateur&nbsp;
                                                            <strong>{deleteUser.email}</strong> ?
                                                        </div>
                                                        {deleteError && <div style={{ color: 'red', marginBottom: 10 }}>{deleteError}</div>}
                                                        <div className={styles.modalDeleteActions}>
                                                            <button type="button" onClick={closeDeleteModal} className={styles.btnCancel}>Annuler</button>
                                                            <button type="button" onClick={confirmDelete} className={styles.btnDelete}>Supprimer</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            // Version desktop/tablette : tableau
                            <table
                                style={{
                                    width: '100%',
                                    background: '#FFD9A0',
                                    color: '#2d2620',
                                    borderRadius: 12,
                                    overflow: 'hidden',
                                    borderCollapse: 'separate',
                                    borderSpacing: 0,
                                    marginTop: 8,
                                    boxShadow: '0 2px 12px #0001',
                                }}
                            >
                                <thead>
                                    <tr style={{ background: '#F7C59F', fontWeight: 700, fontSize: 16 }}>
                                        <th style={{ padding: '12px 18px', textAlign: 'left', borderTopLeftRadius: 10 }}>Email</th>
                                        <th style={{ padding: '12px 18px', textAlign: 'left' }}>Prénom</th>
                                        <th style={{ padding: '12px 18px', textAlign: 'left' }}>Rôle</th>
                                        <th style={{ padding: '12px 18px', textAlign: 'center', borderTopRightRadius: 10 }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.length === 0 && (
                                        <tr>
                                            <td colSpan={4} style={{ color: '#2d2620', textAlign: 'center', padding: 20, fontSize: 15, background: '#FFD9A0' }}>Aucun utilisateur</td>
                                        </tr>
                                    )}
                                    {users.map((user) => (
                                        <tr key={user.type + '-' + user.id} style={{ borderBottom: '1px solid #F7C59F', background: '#fff' }}>
                                            <td style={{ padding: '10px 18px', fontSize: 15, textAlign: 'left' }}>{user.email}</td>
                                            <td style={{ padding: '10px 18px', fontSize: 15, textAlign: 'left' }}>{user.firstname || '-'}</td>
                                            <td style={{ padding: '10px 18px', fontSize: 15, textAlign: 'left' }}>{user.role}</td>
                                            <td style={{ padding: '10px 18px', textAlign: 'center' }}>
                                                <FaEye style={{ color: '#1bac0eff', fontSize: 18, marginRight: 10, verticalAlign: 'middle', cursor: 'pointer' }} title="Voir" onClick={() => handleView(user)} />
                                                <FaRegEdit style={{ color: '#0e4dacff', fontSize: 18, marginRight: 10, verticalAlign: 'middle', cursor: 'pointer', opacity: 1 }} title="Éditer" onClick={() => handleEdit(user)} />
                                                <FaRegTrashAlt style={{ color: '#ac0e20ff', fontSize: 18, verticalAlign: 'middle', cursor: 'pointer', opacity: 1 }} title="Supprimer" onClick={() => handleDelete(user)} />
                                                {/* Modal Supprimer */}
                                                {showDeleteModal && deleteUser && (
                                                    <div style={{
                                                        position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: '#000a', zIndex: 1000,
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                                                    }}>
                                                        <div style={{ background: '#fff', borderRadius: 12, padding: 32, minWidth: 320, boxShadow: '0 2px 24px #0005', position: 'relative', maxWidth: 350 }}>
                                                            <h3 style={{ color: '#ac0e20ff', marginBottom: 18 }}>Supprimer l'utilisateur</h3>
                                                            <div style={{ marginBottom: 16, color: '#2d2620' }}>
                                                                Êtes-vous sûr de vouloir supprimer l'utilisateur&nbsp;
                                                                <strong>{deleteUser.email}</strong> ?
                                                            </div>
                                                            {deleteError && <div style={{ color: 'red', marginBottom: 10 }}>{deleteError}</div>}
                                                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                                                                <button type="button" onClick={closeDeleteModal} style={{ padding: '8px 16px', borderRadius: 6, border: 'none', background: '#ccc', color: '#2d2620', cursor: 'pointer' }}>Annuler</button>
                                                                <button type="button" onClick={confirmDelete} style={{ padding: '8px 16px', borderRadius: 6, border: 'none', background: '#ac0e20ff', color: '#fff', fontWeight: 600, cursor: 'pointer' }}>Supprimer</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                        {/* Modal Voir */}
                        {showViewModal && viewUser && (
                            <div className={styles.modalOverlay}>
                                <div className={styles.modalBox}>
                                    <h3 className={styles.modalViewTitle}>Détail utilisateur</h3>
                                    <div className={styles.modalViewText}><strong>Email :</strong> {viewUser.email}</div>
                                    <div className={styles.modalViewText}><strong>Prénom :</strong> {viewUser.firstname || '-'}</div>
                                    <div className={styles.modalViewText}><strong>Rôle :</strong> {viewUser.role}</div>
                                    <div className={styles.modalViewActions}>
                                        <button type="button" onClick={closeViewModal} className={styles.btnClose}>Fermer</button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Modal d'édition */}
                        {showEditModal && (
                            <div className={styles.modalOverlay}>
                                <div className={styles.modalBox}>
                                    <h3 className={styles.modalEditTitle}>Modifier l'utilisateur</h3>
                                    <form onSubmit={handleEditSubmit}>
                                        <div className={styles.modalEditField}>
                                            <label className={styles.modalEditLabel}>Email</label>
                                            <input type="email" value={editEmail} onChange={e => setEditEmail(e.target.value)} required className={styles.modalEditInput} />
                                        </div>
                                        <div className={styles.modalEditField}>
                                            <label className={styles.modalEditLabel}>Rôle</label>
                                            <select value={editRole} onChange={e => setEditRole(e.target.value)} className={styles.modalEditInput}>
                                                <option value="user">Utilisateur</option>
                                                <option value="admin">Admin</option>
                                            </select>
                                        </div>
                                        {modalError && <div className={styles.modalEditError}>{modalError}</div>}
                                        <div className={styles.modalEditActions}>
                                            <button type="button" onClick={closeModal} className={styles.btnCancel}>Annuler</button>
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

export default UsersAdmin;
