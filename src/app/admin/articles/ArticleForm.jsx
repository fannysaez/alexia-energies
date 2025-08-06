import React, { useState, useEffect } from 'react';
import styles from './articleForm.module.css';

export default function ArticleForm({
    mode = 'add',
    article = null,
    onSuccess,
    onCancel
}) {
    // Clé de sauvegarde locale (unique par mode)
    const LOCAL_STORAGE_KEY = mode === 'edit' && article?.slug ? `articleFormDraft-${article.slug}` : 'articleFormDraft-new';
    // Pagination : étapes du formulaire
    const steps = [
        'Images',
        'Informations principales',
        'Blocs de contenu',
        'Paragraphes'
    ];
    const [currentStep, setCurrentStep] = useState(0);
    // Catégories
    const [categories, setCategories] = useState([]);
    const [categoryId, setCategoryId] = useState(article?.categoryId || '');
    const [newCategory, setNewCategory] = useState('');
    const [catError, setCatError] = useState('');
    const [catSuccess, setCatSuccess] = useState('');
    const [addingCategory, setAddingCategory] = useState(false);

    const [blockTitleLevel, setBlockTitleLevel] = useState('h1');
    // Article
    const [title, setTitle] = useState(article?.titre || '');
    const handleChange = (e) => {
        setNewCategory(e.target.value);
    };
    const [slug, setSlug] = useState(article?.slug || '');
    const [author, setAuthor] = useState(article?.auteur || '');
    const [description, setDescription] = useState(article?.description || '');
    const [content, setContent] = useState(article?.contenu || '');
    const [dateCreation, setDateCreation] = useState(article?.dateCreation ? article.dateCreation.slice(0, 16) : '');
    const [datePublication, setDatePublication] = useState(article?.datePublication ? article.datePublication.slice(0, 16) : '');
    const [statut, setStatut] = useState(article?.statut || 'brouillon');
    const [image, setImage] = useState(null);
    const [imageName, setImageName] = useState('');
    const [imageSuccess, setImageSuccess] = useState('');
    // Image de couverture
    const [coverImage, setCoverImage] = useState(null);
    const [coverImageName, setCoverImageName] = useState('');
    const [coverImagePreview, setCoverImagePreview] = useState('');
    const [coverImageSuccess, setCoverImageSuccess] = useState('');

    // Blocs de contenu
    const [contentBlocks, setContentBlocks] = useState(article?.contentBlocks || []);
    const [blockType, setBlockType] = useState('text');
    const [blockText, setBlockText] = useState('');
    const [blockMedia, setBlockMedia] = useState('');
    const [blockMediaName, setBlockMediaName] = useState('');
    const [blockList, setBlockList] = useState('');
    const [blockSuccess, setBlockSuccess] = useState('');
    // Pour l'édition inline d'un bloc
    const [editingBlockIdx, setEditingBlockIdx] = useState(null);
    const [editBlockType, setEditBlockType] = useState('text');
    const [editBlockText, setEditBlockText] = useState('');
    const [editBlockMedia, setEditBlockMedia] = useState('');
    const [editBlockMediaName, setEditBlockMediaName] = useState('');
    const [editBlockList, setEditBlockList] = useState('');
    const [editBlockTitleLevel, setEditBlockTitleLevel] = useState('h1');

    // Paragraphes (images uniquement)
    const [paragraphs, setParagraphs] = useState(article?.paragraphs || []);
    // Sauvegarde automatique dans le localStorage (hors images binaires)
    // Restauration à l'ouverture
    useEffect(() => {
        // Si pas d'article (création) ou mode edit, on tente de charger le brouillon
        if (typeof window === 'undefined') return;
        const draft = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (draft) {
            try {
                const data = JSON.parse(draft);
                if (!article) {
                    if (data.title) setTitle(data.title);
                    if (data.slug) setSlug(data.slug);
                    if (data.author) setAuthor(data.author);
                    if (data.description) setDescription(data.description);
                    if (data.content) setContent(data.content);
                    if (data.dateCreation) setDateCreation(data.dateCreation);
                    if (data.datePublication) setDatePublication(data.datePublication);
                    if (data.statut) setStatut(data.statut);
                    if (data.categoryId) setCategoryId(data.categoryId);
                    if (data.contentBlocks) setContentBlocks(data.contentBlocks);
                    if (data.paragraphs) setParagraphs(data.paragraphs);
                } else if (mode === 'edit' && article?.slug === data.slug) {
                    // Pour l'édition, on restaure seulement si le slug correspond
                    if (data.title) setTitle(data.title);
                    if (data.author) setAuthor(data.author);
                    if (data.description) setDescription(data.description);
                    if (data.content) setContent(data.content);
                    if (data.dateCreation) setDateCreation(data.dateCreation);
                    if (data.datePublication) setDatePublication(data.datePublication);
                    if (data.statut) setStatut(data.statut);
                    if (data.categoryId) setCategoryId(data.categoryId);
                    if (data.contentBlocks) setContentBlocks(data.contentBlocks);
                    if (data.paragraphs) setParagraphs(data.paragraphs);
                }
            } catch { }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Sauvegarde automatique à chaque modification (hors images binaires)
    useEffect(() => {
        if (typeof window === 'undefined') return;
        const draft = {
            title,
            slug,
            author,
            description,
            content,
            dateCreation,
            datePublication,
            statut,
            categoryId,
            image,
            coverImage,
            contentBlocks,
            paragraphs
        };
        try {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(draft));
        } catch { }
    }, [title, slug, author, description, content, dateCreation, datePublication, statut, categoryId, contentBlocks, paragraphs, LOCAL_STORAGE_KEY]);

    // Fonction pour réinitialiser le brouillon
    const handleResetDraft = () => {
        if (typeof window === 'undefined') return;
        localStorage.removeItem(LOCAL_STORAGE_KEY);
        if (!article) {
            setTitle('');
            setSlug('');
            setAuthor('');
            setDescription('');
            setContent('');
            setDateCreation('');
            setDatePublication('');
            setStatut('brouillon');
            setCategoryId('');
            setContentBlocks([]);
            setParagraphs([]);
        } else {
            setTitle(article.titre || '');
            setSlug(article.slug || '');
            setAuthor(article.auteur || '');
            setDescription(article.description || '');
            setContent(article.contenu || '');
            setDateCreation(article.dateCreation ? article.dateCreation.slice(0, 16) : '');
            setDatePublication(article.datePublication ? article.datePublication.slice(0, 16) : '');
            setStatut(article.statut || 'brouillon');
            setCategoryId(article.categoryId || '');
            setContentBlocks(article.contentBlocks || []);
            setParagraphs(article.paragraphs || []);
        }
    };
    const [paraText, setParaText] = useState('');
    const [paraAltText, setParaAltText] = useState('');
    const [paraImageFile, setParaImageFile] = useState(null);
    const [paraImagePreview, setParaImagePreview] = useState('');
    const [paraImageUrl, setParaImageUrl] = useState('');
    const [paraImageFile2, setParaImageFile2] = useState(null);
    const [paraImagePreview2, setParaImagePreview2] = useState('');
    const [paraImageUrl2, setParaImageUrl2] = useState('');
    const [paraImageName, setParaImageName] = useState('');
    const [paraImageName2, setParaImageName2] = useState('');
    const [paraSuccess, setParaSuccess] = useState('');

    // Modale suppression catégorie
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState(null);

    // Divers
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const MESSAGE_TIMEOUT = 2000;

    // Validation des champs
    const [fieldErrors, setFieldErrors] = useState({});
    const [showValidation, setShowValidation] = useState(false);

    // Fonction helper pour obtenir les classes CSS des champs
    const getFieldClassName = (baseClassName, fieldName) => {
        let className = baseClassName;
        if (showValidation && fieldErrors[fieldName]) {
            className += ` ${styles.inputError} ${styles.fieldError}`;
        }
        return className;
    };

    // Fonction pour effacer l'erreur d'un champ spécifique
    const clearFieldError = (fieldName) => {
        if (fieldErrors[fieldName]) {
            setFieldErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[fieldName];
                return newErrors;
            });
        }
    };

    // Gestionnaires de changement avec nettoyage des erreurs
    const handleTitleChange = (e) => {
        setTitle(e.target.value);
        clearFieldError('title');
    };

    const handleAuthorChange = (e) => {
        setAuthor(e.target.value);
        clearFieldError('author');
    };

    const handleSlugChange = (e) => {
        setSlug(e.target.value);
        clearFieldError('slug');
    };

    const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
        console.log('Description changée:', e.target.value); // Debug
        clearFieldError('description');
    };

    const handleContentChange = (e) => {
        setContent(e.target.value);
        clearFieldError('content');
    };

    const handleCategoryChange = (e) => {
        setCategoryId(e.target.value);
        clearFieldError('categoryId');
    };

    const handleStatutChange = (e) => {
        setStatut(e.target.value);
    };

    const handleImageChangeWithValidation = (e) => {
        handleImageChange(e);
        clearFieldError('image');
    };

    // Modale suppression article
    const [showDeleteArticleModal, setShowDeleteArticleModal] = useState(false);
    const [articleToDelete, setArticleToDelete] = useState(null);

    // Fonction pour ouvrir la modale de suppression article
    const openDeleteArticleModal = (article) => {
        setArticleToDelete(article);
        setShowDeleteArticleModal(true);
    };
    // Fonction pour fermer la modale de suppression article
    const closeDeleteArticleModal = () => {
        setShowDeleteArticleModal(false);
        setArticleToDelete(null);
    };
    // Fonction pour supprimer l'article (API)
    const handleDeleteArticle = async () => {
        if (!articleToDelete) return;
        setLoading(true);
        setError('');
        setSuccess('');
        try {
            const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
            const headers = { 'Content-Type': 'application/json' };
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const res = await fetch(`/api/articles/${articleToDelete.slug}`, {
                method: 'DELETE',
                headers
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Erreur lors de la suppression');
            setSuccess('Article supprimé avec succès !');
            if (onSuccess) onSuccess();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
            closeDeleteArticleModal();
        }
    };
    // Fonction pour fermer la modale de suppression catégorie
    const closeDeleteModal = () => {
        setShowDeleteModal(false);
    };
    // Fonction pour supprimer une catégorie avec confirmation
    const handleDeleteCategory = async () => {
        setCatError('');
        setCatSuccess('');
        try {
            const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
            const headers = { 'Content-Type': 'application/json' };
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const res = await fetch('/api/categories', {
                method: 'DELETE',
                headers,
                body: JSON.stringify({ id: categoryToDelete })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Erreur suppression catégorie');
            setCategories(categories.filter(cat => cat.id !== categoryToDelete));
            if (categoryId === categoryToDelete) setCategoryId('');
            setCatSuccess('Catégorie supprimée !');
        } catch (err) {
            setCatError(err.message);
        } finally {
            setShowDeleteModal(false);
        }
    };
    // Fonction pour ouvrir la modale de suppression catégorie
    const openDeleteModal = (id) => {
        setCategoryToDelete(id);
        setCatSuccess('');
        setCatError('');
        setShowDeleteModal(true);
    };
    // Ajouter un bloc de contenu (fonction indépendante)
    const handleAddBlock = () => {
        const typeUpper = blockType ? blockType.toUpperCase() : undefined;
        let added = false;
        let newBlock = null;
        if (typeUpper === 'TEXT' && blockText.trim()) {
            newBlock = { type: typeUpper, textContent: blockText.trim(), order: contentBlocks.length + 1 };
            setBlockText('');
            added = true;
        } else if (typeUpper === 'IMAGE' && blockMedia.trim()) {
            newBlock = { type: typeUpper, mediaUrl: blockMedia.trim(), order: contentBlocks.length + 1 };
            setBlockMedia('');
            added = true;
        } else if (typeUpper === 'VIDEO' && blockMedia.trim()) {
            newBlock = { type: typeUpper, mediaUrl: blockMedia.trim(), order: contentBlocks.length + 1 };
            setBlockMedia('');
            added = true;
        } else if (typeUpper === 'CITATION' && blockText.trim()) {
            newBlock = { type: typeUpper, textContent: blockText.trim(), order: contentBlocks.length + 1 };
            setBlockText('');
            added = true;
        } else if (typeUpper === 'TITRE' && blockText.trim()) {
            newBlock = { type: typeUpper, textContent: blockText.trim(), titleLevel: blockTitleLevel, order: contentBlocks.length + 1 };
            setBlockText('');
            added = true;
        } else if (typeUpper === 'LISTE' && blockList.trim()) {
            newBlock = { type: typeUpper, textContent: blockList.trim(), order: contentBlocks.length + 1 };
            setBlockList('');
            added = true;
        } else if (typeUpper === 'PARAGRAPHE' && blockText.trim()) {
            newBlock = { type: typeUpper, textContent: blockText.trim(), order: contentBlocks.length + 1 };
            setBlockText('');
            added = true;
        }
        if (added && newBlock) {
            newBlock.type = newBlock.type ? newBlock.type.toUpperCase() : undefined;
            setContentBlocks([...contentBlocks, newBlock]);
            setBlockSuccess('Bloc ajouté !');
            setTimeout(() => setBlockSuccess(''), MESSAGE_TIMEOUT);
        }
    };

    // Charger les catégories
    useEffect(() => {
        fetch('/api/categories')
            .then(res => res.json())
            .then(data => setCategories(data))
            .catch(() => setCategories([]));
    }, []);

    // Gestion image principale
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file || null);
        setImageName(''); // Laisser vide pour permettre la saisie personnalisée
        if (file) {
            setImageSuccess('Image sélectionnée !');
        }
    };
    // Gestion image de couverture
    const handleCoverImageChange = (e) => {
        const file = e.target.files[0];
        setCoverImage(file || null);
        setCoverImageName(''); // Laisser vide pour permettre la saisie personnalisée
        setCoverImagePreview(file ? URL.createObjectURL(file) : '');
        if (file) {
            setCoverImageSuccess('Image de couverture sélectionnée !');
        }
    };
    // Ajout catégorie
    const handleAddCategory = async () => {
        setCatSuccess('');
        if (!newCategory.trim()) {
            setCatError('Le nom est requis');
            return;
        }
        setAddingCategory(true);
        try {
            const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
            const headers = { 'Content-Type': 'application/json' };
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const res = await fetch('/api/categories', {
                method: 'POST',
                headers,
                body: JSON.stringify({ name: newCategory.trim() })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Erreur création catégorie');
            setCategories([...categories, data]);
            setCategoryId(data.id);
            setNewCategory('');
            setCatSuccess('Catégorie ajoutée !');
        } catch (err) {
            setCatError(err.message);
        } finally {
            setAddingCategory(false);
        }
    };

    // Éditer un bloc (depuis le formulaire inline)
    const handleEditBlock = (idx, newBlock) => {
        setContentBlocks(contentBlocks.map((block, i) => {
            if (i === idx) {
                const type = newBlock.type || block.type;
                return {
                    ...block,
                    ...newBlock,
                    type: type ? type.toUpperCase() : undefined
                };
            }
            return block;
        }));
    };

    // Ouvre le formulaire d'édition pour un bloc
    const startEditBlock = (idx) => {
        const block = contentBlocks[idx];
        setEditingBlockIdx(idx);
        setEditBlockType(block.type ? block.type.toLowerCase() : 'text');
        setEditBlockText(block.textContent || '');
        setEditBlockMedia(block.mediaUrl || '');
        setEditBlockMediaName('');
        setEditBlockList(block.textContent || '');
        setEditBlockTitleLevel(block.titleLevel || 'h1');
    };

    // Annule l'édition
    const cancelEditBlock = () => {
        setEditingBlockIdx(null);
        setEditBlockType('text');
        setEditBlockText('');
        setEditBlockMedia('');
        setEditBlockMediaName('');
        setEditBlockList('');
        setEditBlockTitleLevel('h1');
    };

    // Valide la modification
    const saveEditBlock = async () => {
        let newBlock = null;
        const typeUpper = editBlockType ? editBlockType.toUpperCase() : undefined;
        if (typeUpper === 'TEXT' && editBlockText.trim()) {
            newBlock = { type: typeUpper, textContent: editBlockText.trim(), order: editingBlockIdx + 1 };
        } else if (typeUpper === 'IMAGE' && editBlockMedia.trim()) {
            newBlock = { type: typeUpper, mediaUrl: editBlockMedia.trim(), order: editingBlockIdx + 1 };
        } else if (typeUpper === 'VIDEO' && editBlockMedia.trim()) {
            newBlock = { type: typeUpper, mediaUrl: editBlockMedia.trim(), order: editingBlockIdx + 1 };
        } else if (typeUpper === 'CITATION' && editBlockText.trim()) {
            newBlock = { type: typeUpper, textContent: editBlockText.trim(), order: editingBlockIdx + 1 };
        } else if (typeUpper === 'TITRE' && editBlockText.trim()) {
            newBlock = { type: typeUpper, textContent: editBlockText.trim(), titleLevel: editBlockTitleLevel, order: editingBlockIdx + 1 };
        } else if (typeUpper === 'LISTE' && editBlockList.trim()) {
            newBlock = { type: typeUpper, textContent: editBlockList.trim(), order: editingBlockIdx + 1 };
        } else if (typeUpper === 'PARAGRAPHE' && editBlockText.trim()) {
            newBlock = { type: typeUpper, textContent: editBlockText.trim(), order: editingBlockIdx + 1 };
        }
        if (newBlock) {
            handleEditBlock(editingBlockIdx, newBlock);
            cancelEditBlock();
        }
    };

    // Supprimer un bloc
    const handleDeleteBlock = (idx) => {
        setContentBlocks(contentBlocks.filter((_, i) => i !== idx).map((b, i) => ({ ...b, order: i + 1 })));
    };

    // Déplacer un bloc
    const handleMoveBlock = (idx, direction) => {
        const newBlocks = [...contentBlocks];
        if (direction === 'up' && idx > 0) {
            [newBlocks[idx - 1], newBlocks[idx]] = [newBlocks[idx], newBlocks[idx - 1]];
        } else if (direction === 'down' && idx < newBlocks.length - 1) {
            [newBlocks[idx], newBlocks[idx + 1]] = [newBlocks[idx + 1], newBlocks[idx]];
        }
        setContentBlocks(newBlocks.map((b, i) => ({ ...b, order: i + 1 })));
    };

    // Gestion upload image paragraphe 1
    const handleParaImageFileChange = (e) => {
        const file = e.target.files[0];
        setParaImageFile(file || null);
        setParaImagePreview(file ? URL.createObjectURL(file) : '');
        setParaImageUrl('');
        setParaImageName(''); // Laisser vide pour permettre la saisie personnalisée
    };

    // Gestion upload image paragraphe 2
    const handleParaImageFileChange2 = (e) => {
        const file = e.target.files[0];
        setParaImageFile2(file || null);
        setParaImagePreview2(file ? URL.createObjectURL(file) : '');
        setParaImageUrl2('');
        setParaImageName2(''); // Laisser vide pour permettre la saisie personnalisée
    };

    // Ajouter un paragraphe
    const handleAddParagraph = async () => {
        if (!paraText && !paraImageUrl && !paraImageFile && !paraImageUrl2 && !paraImageFile2) {
            setParaSuccess('');
            alert('Veuillez ajouter du texte ou au moins une image pour créer un paragraphe.');
            return;
        }

        try {
            let image_url = paraImageUrl;
            let image_url2 = paraImageUrl2;

            // upload image 1 si fichier
            if (paraImageFile) {
                const formData = new FormData();
                formData.append('file', paraImageFile);
                if (paraImageName.trim() !== '') {
                    formData.append('newName', paraImageName.trim());
                }

                const res = await fetch('/api/upload-image', {
                    method: 'POST',
                    body: formData,
                });
                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.error || `Erreur upload image 1: ${res.status}`);
                }

                if (data.imageUrl) {
                    image_url = data.imageUrl;
                }
            }

            // upload image 2 si fichier
            if (paraImageFile2) {
                const formData2 = new FormData();
                formData2.append('file', paraImageFile2);
                if (paraImageName2.trim() !== '') {
                    formData2.append('newName', paraImageName2.trim());
                }

                const res2 = await fetch('/api/upload-image', {
                    method: 'POST',
                    body: formData2,
                });
                const data2 = await res2.json();

                if (!res2.ok) {
                    throw new Error(data2.error || `Erreur upload image 2: ${res2.status}`);
                }

                if (data2.imageUrl) {
                    image_url2 = data2.imageUrl;
                }
            }

            // Ajouter le paragraphe
            setParagraphs([...paragraphs, {
                texte: paraText,
                image_url,
                image_url2,
                alt_text: paraAltText,
                ordre: paragraphs.length + 1,
            }]);

            // Réinitialiser les champs
            setParaText('');
            setParaImageUrl('');
            setParaImageFile(null);
            setParaImagePreview('');
            setParaImageUrl2('');
            setParaImageFile2(null);
            setParaImagePreview2('');
            setParaImageName('');
            setParaImageName2('');
            setParaAltText('');

            setParaSuccess('Paragraphe ajouté !');
            setTimeout(() => setParaSuccess(''), MESSAGE_TIMEOUT);

        } catch (error) {
            console.error('Erreur lors de l\'ajout du paragraphe:', error);
            setParaSuccess('');
            alert(`Erreur lors de l'upload: ${error.message}`);
        }
    };

    // Éditer un paragraphe
    const handleEditParagraph = (idx, newPara) => {
        setParagraphs(paragraphs.map((para, i) => i === idx ? { ...para, ...newPara } : para));
    };

    // Supprimer un paragraphe
    const handleDeleteParagraph = (idx) => {
        setParagraphs(paragraphs.filter((_, i) => i !== idx).map((p, i) => ({ ...p, ordre: i + 1 })));
    };

    // Déplacer un paragraphe
    const handleMoveParagraph = (idx, direction) => {
        const newParas = [...paragraphs];
        if (direction === 'up' && idx > 0) {
            [newParas[idx - 1], newParas[idx]] = [newParas[idx], newParas[idx - 1]];
        } else if (direction === 'down' && idx < newParas.length - 1) {
            [newParas[idx], newParas[idx + 1]] = [newParas[idx + 1], newParas[idx]];
        }
        setParagraphs(newParas.map((p, i) => ({ ...p, ordre: i + 1 })));
    };

    // Upload image paragraphe
    const handleUploadParaImage = async (idx, key, e) => {
        const file = e.target.files[0];
        if (!file) return;
        const formData = new FormData();
        formData.append('file', file);
        // Pas de nom personnalisé pour éviter les doubles extensions
        try {
            const res = await fetch('/api/upload-image', {
                method: 'POST',
                body: formData,
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Erreur upload image');
            setParagraphs(paragraphs.map((p, i) => i === idx ? { ...p, [key]: data.imageUrl } : p));
            setParaSuccess('Image téléchargée !');
            setTimeout(() => setParaSuccess(''), MESSAGE_TIMEOUT);
        } catch (err) {
            setParaSuccess('');
            setError(err.message);
            setTimeout(() => setError(''), MESSAGE_TIMEOUT);
        }
    };

    // Fonction de validation des champs obligatoires
    const validateRequiredFields = () => {
        const errors = {};
        let hasErrors = false;

        // Vérification des champs obligatoires
        if (!title.trim()) {
            errors.title = 'Le titre est obligatoire';
            hasErrors = true;
        }
        if (!slug.trim()) {
            errors.slug = 'Le slug est obligatoire';
            hasErrors = true;
        }
        if (!author.trim()) {
            errors.author = 'L\'auteur est obligatoire';
            hasErrors = true;
        }
        if (!content.trim()) {
            errors.content = 'Le contenu est obligatoire';
            hasErrors = true;
        }
        if (!categoryId) {
            errors.categoryId = 'La catégorie est obligatoire';
            hasErrors = true;
        }
        if (!image && !article?.image) {
            errors.image = 'L\'image principale est obligatoire';
            hasErrors = true;
        }

        setFieldErrors(errors);
        setShowValidation(true);
        return !hasErrors;
    };

    // Soumission du formulaire
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation côté client avant soumission
        if (!validateRequiredFields()) {
            setLoading(false);
            setError('Veuillez remplir tous les champs obligatoires marqués d\'un astérisque (*)');
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');
        setFieldErrors({}); // Réinitialiser les erreurs si validation OK
        try {
            let imageUrl = article?.image || '';
            if (image) {
                const formData = new FormData();
                formData.append('file', image);
                if (imageName.trim() !== '') {
                    formData.append('newName', imageName.trim());
                }
                const res = await fetch('/api/upload-image', {
                    method: 'POST',
                    body: formData,
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || 'Erreur upload image');
                imageUrl = data.imageUrl;
            }
            let coverImageUrl = article?.imageCouverture || '';
            if (coverImage) {
                const formData = new FormData();
                formData.append('file', coverImage);
                if (coverImageName.trim() !== '') {
                    formData.append('newName', coverImageName.trim());
                }
                const res = await fetch('/api/upload-image', {
                    method: 'POST',
                    body: formData,
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || 'Erreur upload image de couverture');
                coverImageUrl = data.imageUrl;
            }
            let res, data;
            const payload = {
                titre: title,
                slug,
                description,
                contenu: content,
                auteur: author,
                statut,
                image: imageUrl,
                imageCouverture: coverImageUrl,
                categoryId,
                contentBlocks,
                paragraphs,
                dateCreation: dateCreation ? new Date(dateCreation).toISOString() : null,
                datePublication: datePublication ? new Date(datePublication).toISOString() : null,
            };

            // Debug: Afficher le payload avant envoi
            console.log('Payload envoyé:', payload);

            // Récupération du token d'authentification
            const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
            const headers = {
                'Content-Type': 'application/json'
            };
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            if (mode === "edit" && article) {
                res = await fetch(`/api/articles/${article.slug}`, {
                    method: 'PUT',
                    headers,
                    body: JSON.stringify(payload)
                });
                data = await res.json();
                if (!res.ok) throw new Error(data.error || 'Erreur lors de la modification');
                setSuccess('Article modifié avec succès !');
            } else {
                res = await fetch('/api/articles', {
                    method: 'POST',
                    headers,
                    body: JSON.stringify(payload)
                });
                data = await res.json();
                if (!res.ok) throw new Error(data.error || 'Erreur lors de l\'ajout');
                setSuccess('Article ajouté avec succès !');
                setTitle('');
                setSlug('');
                setContent('');
                setAuthor('');
                setImage(null);
                setCategoryId('');
                setContentBlocks([]);
                setParagraphs([]);
                setCoverImage(null);
                setCoverImageName('');
                setCoverImagePreview('');
            }
            if (onSuccess) onSuccess();
            // Nettoyage du brouillon après soumission
            if (typeof window !== 'undefined') {
                localStorage.removeItem(LOCAL_STORAGE_KEY);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className={styles.formWrapper}>
            <h2 className={styles.formTitle}>{mode === "edit" ? "Modifier l'article" : "Ajouter un article"}</h2>

            {/* Note d'aide pour les champs obligatoires */}
            <div className={styles.requiredFieldsNote}>
                <strong>📝 Note :</strong> Les champs marqués d'un astérisque (<span className={styles.asterisk}>*</span>) sont obligatoires pour publier l'article.
            </div>

            {/* Sauvegarde automatique locale */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
                <button type="button" onClick={handleResetDraft} style={{ background: '#FFD9A0', color: '#222', border: 'none', borderRadius: 4, padding: '4px 12px', cursor: 'pointer', fontWeight: 600 }}>
                    Réinitialiser le brouillon
                </button>
            </div>
            {/* Barre d'étapes */}
            <div className={styles.paginationSteps}>
                {steps.map((step, idx) => (
                    <div
                        key={step}
                        className={
                            styles.paginationStep +
                            ' ' + (idx === currentStep ? styles.active : styles.inactive)
                        }
                    >
                        {idx + 1}. {step}
                    </div>
                ))}
            </div>




            {/* Étape 1 : Images */}
            {currentStep === 0 && (
                <div className={styles.imageSection}>
                    {/* Encadré image de couverture (miniature) déplacé ici */}
                    <div className={styles.miniatureSection}>
                        <h3 className={styles.miniatureTitle}>Image de couverture (miniature)</h3>
                        <p className={styles.miniatureHelp}>
                            Cette image sera utilisée comme miniature sur la page d'accueil et la liste des articles.<br />
                            <strong>La miniature affichera en priorité l’image de couverture, puis l’image principale, puis la première image de paragraphe.</strong>
                        </p>
                        {article?.imageCouverture && !coverImagePreview && (
                            <img src={article.imageCouverture} alt="aperçu couverture" className={styles.mainImageMiniature} />
                        )}
                        <div className={styles.imageInputRow}>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleCoverImageChange}
                                className={styles.inputImageFile}
                                key={coverImageName || ''}
                            />
                            <input
                                type="text"
                                placeholder="Nom du fichier couverture (optionnel)"
                                value={coverImageName}
                                onChange={e => setCoverImageName(e.target.value)}
                                className={styles.inputImageName}
                            />
                        </div>
                        {coverImagePreview && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
                                <img src={coverImagePreview} alt="Aperçu couverture" className={styles.mainImageMiniature} style={{ maxWidth: 120 }} />
                                <button type="button" onClick={() => { setCoverImage(null); setCoverImagePreview(''); setCoverImageName(''); }} className={styles.deleteParaImageBtn}>✕</button>
                            </div>
                        )}
                        {coverImageSuccess && <span className={styles.successMsg}>{coverImageSuccess}</span>}
                    </div>
                    {/* Image principale */}
                    <div className={styles.miniatureSection}>
                        <h3 className={`${styles.miniatureTitle} ${styles.labelRequired}`}>Image principale</h3>
                        <p className={styles.miniatureHelp}>
                            Cette image s’affiche en haut de l’article, dans la page de détail.<br />
                            <strong>Si l’image de couverture n’est pas renseignée, cette image pourra être utilisée comme miniature.</strong>
                        </p>
                        {showValidation && fieldErrors.image && (
                            <div className={styles.errorMsg}>{fieldErrors.image}</div>
                        )}
                        {article?.image && !image && (
                            <img src={article.image} alt="aperçu" className={styles.mainImageMiniature} />
                        )}
                        <div className={styles.imageInputRow}>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChangeWithValidation}
                                className={styles.inputImageFile}
                                key={imageName || ''}
                            />
                            <input
                                type="text"
                                placeholder="Nom du fichier (optionnel)"
                                value={imageName}
                                onChange={e => setImageName(e.target.value)}
                                className={styles.inputImageName}
                            />
                        </div>
                        {image && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
                                <img src={URL.createObjectURL(image)} alt="Aperçu image principale" className={styles.mainImageMiniature} style={{ maxWidth: 120 }} />
                                <button type="button" onClick={() => { setImage(null); setImageName(''); }} className={styles.deleteParaImageBtn}>✕</button>
                            </div>
                        )}
                        {imageSuccess && <span className={styles.successMsg}>{imageSuccess}</span>}
                    </div>
                </div>
            )}

            {/* Étape 2 : Infos principales & catégorie */}
            {currentStep === 1 && (
                <div className={styles.formContentWrapper}>
                    <div className={styles.formFieldsColumn}>
                        <input
                            type="text"
                            placeholder="Titre *"
                            value={title}
                            onChange={handleTitleChange}
                            required
                            className={getFieldClassName(styles.inputTitle, 'title')}
                        />
                        {showValidation && fieldErrors.title && (
                            <div className={styles.errorMsg}>{fieldErrors.title}</div>
                        )}
                        <input
                            type="text"
                            placeholder="Auteur *"
                            value={author}
                            onChange={handleAuthorChange}
                            required
                            className={getFieldClassName(styles.inputAuthor, 'author')}
                        />
                        {showValidation && fieldErrors.author && (
                            <div className={styles.errorMsg}>{fieldErrors.author}</div>
                        )}
                        <input
                            type="text"
                            placeholder="Slug (ex: mon-article) *"
                            value={slug}
                            onChange={handleSlugChange}
                            required
                            className={getFieldClassName(styles.inputSlug, 'slug')}
                        />
                        {showValidation && fieldErrors.slug && (
                            <div className={styles.errorMsg}>{fieldErrors.slug}</div>
                        )}
                        <textarea
                            placeholder="Description courte de l'article"
                            value={description}
                            onChange={handleDescriptionChange}
                            className={styles.textareaDescription}
                            rows={3}
                        />
                        {showValidation && fieldErrors.description && (
                            <div className={styles.errorMsg}>{fieldErrors.description}</div>
                        )}
                        <label htmlFor="dateCreation" style={{ color: '#FFD9A0', fontWeight: 'bold', marginTop: 8 }}>Date de création</label>
                        <input
                            type="datetime-local"
                            id="dateCreation"
                            className={styles.inputTitle}
                            value={dateCreation}
                            onChange={e => setDateCreation(e.target.value)}
                            required
                            style={{ marginBottom: 8 }}
                        />
                        <label htmlFor="datePublication" style={{ color: '#FFD9A0', fontWeight: 'bold', marginTop: 8 }}>Date de publication</label>
                        <input
                            type="datetime-local"
                            id="datePublication"
                            className={styles.inputTitle}
                            value={datePublication}
                            onChange={e => setDatePublication(e.target.value)}
                            style={{ marginBottom: 8 }}
                        />
                        <label htmlFor="statut" style={{ color: '#FFD9A0', fontWeight: 'bold', marginTop: 8 }}>Statut</label>
                        <select
                            id="statut"
                            className={styles.inputTitle}
                            value={statut}
                            onChange={handleStatutChange}
                            style={{ marginBottom: 8 }}
                        >
                            <option value="brouillon">📝 Brouillon</option>
                            <option value="publié">✅ Publié</option>
                        </select>
                        <textarea
                            placeholder="Contenu *"
                            value={content}
                            onChange={handleContentChange}
                            rows={7}
                            className={getFieldClassName(styles.textareaContent, 'content')}
                            required
                        />
                        {showValidation && fieldErrors.content && (
                            <div className={styles.errorMsg}>{fieldErrors.content}</div>
                        )}
                        <div className={styles.articleMiniaturePreview} style={{ border: '2px dashed #FFD9A0', borderRadius: 8, padding: 16, margin: '24px 0', background: '#222' }}>
                            <div style={{ fontWeight: 'bold', color: '#FFD9A0', marginBottom: 8 }}>Aperçu de la miniature de l'article</div>
                            <div style={{ color: '#FFD9A0', fontSize: '0.95em', marginBottom: 8 }}>
                                <strong>La miniature affichera en priorité l’image de couverture, puis l’image principale, puis la première image de paragraphe.</strong>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                <div>
                                    {(coverImagePreview || article?.imageCouverture) ? (
                                        <img src={coverImagePreview || article?.imageCouverture} alt="Miniature" style={{ maxWidth: 120, borderRadius: 6, boxShadow: '0 0 8px #FFD9A0' }} />
                                    ) : (
                                        <div style={{ width: 120, height: 80, background: '#444', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFD9A0' }}>Aucune image</div>
                                    )}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: '1.1em', fontWeight: 'bold', color: '#FFD9A0' }}>{title || 'Titre de l\'article'}</div>
                                    <div style={{ color: '#FFD9A0', fontSize: '0.95em', marginTop: 2 }}>Auteur : <span style={{ color: '#fff' }}>{author || 'Auteur'}</span></div>
                                    <div style={{ color: '#FFD9A0', fontSize: '0.95em', marginTop: 2 }}>Slug : <span style={{ color: '#fff' }}>{slug || 'slug-article'}</span></div>
                                    <div style={{ color: '#FFD9A0', fontSize: '0.95em', marginTop: 2 }}>Date : <span style={{ color: '#fff' }}>{datePublication ? new Date(datePublication).toLocaleDateString() : 'JJ/MM/AAAA'}</span></div>
                                    <div style={{ color: '#FFD9A0', fontSize: '0.95em', marginTop: 2 }}>Statut : <span style={{ color: statut === 'publié' ? '#4BB543' : '#FFA500' }}>{statut === 'publié' ? '✅ Publié' : '📝 Brouillon'}</span></div>
                                    <div style={{ color: '#FFD9A0', fontSize: '0.95em', marginTop: 2 }}>Description : <span style={{ color: '#fff' }}>{content ? content.slice(0, 120) + (content.length > 120 ? '...' : '') : 'Courte description de l\'article'}</span></div>
                                </div>
                            </div>
                        </div>
                        <label className={`${styles.labelCategory} ${styles.labelRequired}`}>Catégorie</label>
                        <div className={styles.categoryAddWrapper}>
                            <div className={styles.categoryAddRow}>
                                <select
                                    value={categoryId}
                                    onChange={handleCategoryChange}
                                    required
                                    className={getFieldClassName(styles.selectCategory, 'categoryId')}
                                >
                                    <option value="">-- Sélectionner une catégorie * --</option>
                                    {Array.isArray(categories) && categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                                {showValidation && fieldErrors.categoryId && (
                                    <div className={styles.errorMsg}>{fieldErrors.categoryId}</div>
                                )}
                                <input
                                    className={styles.inputNewCategory}
                                    type="text"
                                    value={newCategory}
                                    onChange={handleChange}
                                    placeholder="Nouvelle catégorie"
                                />
                                <button
                                    className={styles.addCategoryBtn}
                                    onClick={handleAddCategory}
                                    disabled={!newCategory}
                                >
                                    Ajouter
                                </button>
                            </div>
                            <span className={styles.categoryHelp}>
                                La catégorie permet de classer l’article. Si aucune catégorie n’est disponible, ajoutez-en une ci-dessous.
                            </span>
                            <div className={styles.categoryListWrapper}>
                                {categories.map((cat, idx) => (
                                    <span key={cat.id ? cat.id : idx} className={styles.categoryItem}>
                                        {cat.name ? cat.name : cat}
                                        <button
                                            className={styles.deleteCategoryBtn}
                                            onClick={() => openDeleteModal(cat.id ? cat.id : cat)}
                                        >
                                            ×
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>
                        {catError && <span className={styles.errorMsg}>{catError}</span>}
                        {catSuccess && <span className={styles.successMsg}>{catSuccess}</span>}
                    </div>
                </div>
            )}

            {/* Étape 3 : Blocs de contenu */}
            {currentStep === 2 && (
                <div className={styles.formContentWrapper}>
                    <div className={styles.contentBlocksSection}>
                        {/* ...existing code... */}
                        <label className={styles.labelContentBlocks}>Blocs de contenu</label>
                        <div className={styles.contentBlocksInputRow}>
                            {/* ...existing code... */}
                            <select value={blockType} onChange={e => setBlockType(e.target.value)} className={styles.selectBlockType}>
                                <option value="text">Texte</option>
                                <option value="image">Image</option>
                                <option value="video">Vidéo</option>
                                <option value="citation">Citation</option>
                                <option value="titre">Titre</option>
                                <option value="liste">Liste</option>
                                <option value="paragraphe">Paragraphe</option>
                            </select>
                            {blockType === 'text' && (
                                <textarea placeholder="Texte du bloc" value={blockText} onChange={e => setBlockText(e.target.value)} className={styles.textareaBlockList} rows={3} />
                            )}
                            {blockType === 'image' && (
                                <div className={styles.miniatureSection}>
                                    <h3 className={styles.miniatureTitle}>Image du bloc</h3>
                                    <p className={styles.miniatureHelp}>
                                        Cette image illustre un bloc de contenu dans l’article.<br />
                                        <strong>Si aucune image de couverture, image principale ou image de paragraphe n’est renseignée, la première image de bloc pourra être utilisée comme miniature.</strong>
                                    </p>
                                    <input type="file" accept="image/*" onChange={async e => {
                                        const file = e.target.files[0];
                                        setBlockMediaName(''); // Laisser vide pour permettre la saisie personnalisée
                                        if (file) {
                                            const formData = new FormData();
                                            formData.append('file', file);
                                            if (blockMediaName.trim() !== '') {
                                                formData.append('newName', blockMediaName.trim());
                                            }
                                            try {
                                                const res = await fetch('/api/upload-image', {
                                                    method: 'POST',
                                                    body: formData,
                                                });
                                                const data = await res.json();
                                                if (res.ok && data.imageUrl) setBlockMedia(data.imageUrl);
                                            } catch { }
                                        }
                                    }} className={styles.inputBlockText} key={blockMediaName || `block-img-new`} />
                                    <input type="text" placeholder="Nom du fichier bloc image (optionnel)" value={blockMediaName} onChange={e => setBlockMediaName(e.target.value)} className={styles.inputImageName} />
                                    {blockMedia && (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
                                            <img src={blockMedia} alt="Aperçu bloc image" style={{ maxWidth: 120 }} />
                                            <button type="button" onClick={() => { setBlockMedia(''); setBlockMediaName(''); }} className={styles.deleteParaImageBtn}>✕</button>
                                        </div>
                                    )}
                                </div>
                            )}
                            {blockType === 'video' && (
                                <>
                                    <input type="text" placeholder="URL vidéo YouTube/Vimeo" value={blockMedia} onChange={e => setBlockMedia(e.target.value)} className={styles.inputBlockText} />
                                    {blockMedia && (/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be|vimeo\.com)\//.test(blockMedia)) && (
                                        <div style={{ marginTop: 8 }}>
                                            <iframe
                                                src={blockMedia}
                                                title="Vidéo"
                                                className={styles.contentBlockVideo}
                                                allowFullScreen
                                                frameBorder="0"
                                                width="400"
                                                height="220"
                                            />
                                        </div>
                                    )}
                                </>
                            )}
                            {blockType === 'citation' && (
                                <textarea placeholder="Texte de la citation" value={blockText} onChange={e => setBlockText(e.target.value)} className={styles.textareaBlockList} rows={3} />
                            )}
                            {blockType === 'titre' && (
                                <>
                                    <textarea placeholder="Texte du titre" value={blockText} onChange={e => setBlockText(e.target.value)} className={styles.textareaBlockList} rows={2} />
                                    <select value={blockTitleLevel} onChange={e => setBlockTitleLevel(e.target.value)} className={styles.selectBlockTitleLevel} style={{ marginLeft: 8 }}>
                                        <option value="h1">H1</option>
                                        <option value="h2">H2</option>
                                        <option value="h3">H3</option>
                                        <option value="h4">H4</option>
                                        <option value="h5">H5</option>
                                        <option value="h6">H6</option>
                                    </select>
                                </>
                            )}
                            {blockType === 'liste' && (
                                <textarea placeholder="Liste (une ligne par élément)" value={blockList} onChange={e => setBlockList(e.target.value)} className={styles.textareaBlockList} />
                            )}
                            {blockType === 'paragraphe' && (
                                <textarea placeholder="Texte du paragraphe" value={blockText} onChange={e => setBlockText(e.target.value)} className={styles.textareaBlockList} rows={3} />
                            )}
                            <button type="button" onClick={handleAddBlock} className={styles.addBlockBtn}>Ajouter bloc</button>
                        </div>
                        <div className={styles.contentBlocksListWrapper}>
                            {contentBlocks.map((block, idx) => (
                                <div key={idx} className={styles.contentBlockItem}>
                                    {editingBlockIdx === idx ? (
                                        <div className={styles.contentBlockEditRow}>
                                            <select value={editBlockType} onChange={e => setEditBlockType(e.target.value)} className={styles.selectBlockType}>
                                                <option value="text">Texte</option>
                                                <option value="image">Image</option>
                                                <option value="video">Vidéo</option>
                                                <option value="citation">Citation</option>
                                                <option value="titre">Titre</option>
                                                <option value="liste">Liste</option>
                                                <option value="paragraphe">Paragraphe</option>
                                            </select>
                                            {editBlockType === 'text' && (
                                                <textarea placeholder="Texte du bloc" value={editBlockText} onChange={e => setEditBlockText(e.target.value)} className={styles.textareaBlockEdit} rows={3} />
                                            )}
                                            {editBlockType === 'image' && (
                                                <>
                                                    <input type="text" placeholder="URL de l'image" value={editBlockMedia} onChange={e => setEditBlockMedia(e.target.value)} className={styles.inputBlockEdit} />
                                                </>
                                            )}
                                            {editBlockType === 'video' && (
                                                <input type="text" placeholder="URL vidéo YouTube/Vimeo" value={editBlockMedia} onChange={e => setEditBlockMedia(e.target.value)} className={styles.inputBlockEdit} />
                                            )}
                                            {editBlockType === 'citation' && (
                                                <textarea placeholder="Texte de la citation" value={editBlockText} onChange={e => setEditBlockText(e.target.value)} className={styles.textareaBlockEdit} rows={3} />
                                            )}
                                            {editBlockType === 'titre' && (
                                                <>
                                                    <textarea placeholder="Texte du titre" value={editBlockText} onChange={e => setEditBlockText(e.target.value)} className={styles.textareaBlockEdit} rows={2} />
                                                    <select value={editBlockTitleLevel} onChange={e => setEditBlockTitleLevel(e.target.value)} className={styles.selectBlockTitleLevel} style={{ marginLeft: 8 }}>
                                                        <option value="h1">H1</option>
                                                        <option value="h2">H2</option>
                                                        <option value="h3">H3</option>
                                                        <option value="h4">H4</option>
                                                        <option value="h5">H5</option>
                                                        <option value="h6">H6</option>
                                                    </select>
                                                </>
                                            )}
                                            {editBlockType === 'liste' && (
                                                <textarea placeholder="Liste (une ligne par élément)" value={editBlockList} onChange={e => setEditBlockList(e.target.value)} className={styles.textareaBlockEdit} />
                                            )}
                                            {editBlockType === 'paragraphe' && (
                                                <textarea placeholder="Texte du paragraphe" value={editBlockText} onChange={e => setEditBlockText(e.target.value)} className={styles.textareaBlockEdit} rows={3} />
                                            )}
                                            <button type="button" onClick={saveEditBlock} className={styles.addBlockBtn} style={{ minWidth: 80 }}>Valider</button>
                                            <button type="button" onClick={cancelEditBlock} className={styles.cancelBtn} style={{ minWidth: 80 }}>Annuler</button>
                                        </div>
                                    ) : (
                                        <>
                                            {/* Affichage du contenu du bloc selon son type */}
                                            {block.type === 'TEXT' && (
                                                <div style={{ whiteSpace: 'pre-line' }}>{block.textContent}</div>
                                            )}
                                            {block.type === 'IMAGE' && block.mediaUrl && (
                                                <img src={block.mediaUrl} alt={block.mediaUrl} style={{ maxWidth: 200, maxHeight: 200, display: 'block', margin: '0 auto' }} />
                                            )}
                                            {block.type === 'VIDEO' && block.mediaUrl && (
                                                <iframe
                                                    src={block.mediaUrl}
                                                    title={`Vidéo ${idx + 1}`}
                                                    className={styles.contentBlockVideo}
                                                    allowFullScreen
                                                    frameBorder="0"
                                                    width="400"
                                                    height="220"
                                                    style={{ display: 'block', margin: '0 auto' }}
                                                />
                                            )}
                                            {block.type === 'CITATION' && (
                                                <blockquote className={styles.contentBlockCitation}>{block.textContent}</blockquote>
                                            )}
                                            {block.type === 'TITRE' && (
                                                React.createElement(block.titleLevel || 'h2', { style: { color: '#FFD9A0', margin: '8px 0' } }, block.textContent)
                                            )}
                                            {block.type === 'LISTE' && block.textContent && (
                                                <ul style={{ margin: '8px 0 8px 24px' }}>
                                                    {block.textContent.split('\n').map((item, i) => (
                                                        <li key={i}>{item}</li>
                                                    ))}
                                                </ul>
                                            )}
                                            {block.type === 'PARAGRAPHE' && (
                                                <div style={{ margin: '8px 0' }}>{block.textContent}</div>
                                            )}
                                            {/* Actions d'édition/suppression/déplacement */}
                                            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                                                <button type="button" onClick={() => handleMoveBlock(idx, 'up')} className={styles.paragraphActionBtn} title="Monter">▲</button>
                                                <button type="button" onClick={() => handleMoveBlock(idx, 'down')} className={styles.paragraphActionBtn} title="Descendre">▼</button>
                                                <button type="button" onClick={() => startEditBlock(idx)} className={styles.addBlockBtn} style={{ minWidth: 80 }}>Éditer</button>
                                                <button type="button" onClick={() => handleDeleteBlock(idx)} className={styles.paragraphActionBtn} title="Supprimer">✕</button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Étape 4 : Paragraphes */}
            {currentStep === 3 && (
                <div className={styles.formContentWrapper}>
                    {/* Aperçu miniatures paragraphes */}
                    {paragraphs.length > 0 && (
                        <div style={{ marginBottom: 18, marginTop: 18 }}>
                            <label style={{ color: '#FFD9A0', fontWeight: 'bold', marginBottom: 6, display: 'block' }}>Miniatures paragraphes</label>
                            <div className={styles.paragraphImagesMiniRow} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '34px' }}>
                                {paragraphs.map((para, idx) => (
                                    <React.Fragment key={para.id || idx}>
                                        {para.image_url && (
                                            <img src={para.image_url} alt={para.alt_text || `Miniature ${idx + 1}`} className={styles.paragraphImage} />
                                        )}
                                        {para.image_url2 && (
                                            <img src={para.image_url2} alt={para.alt_text || `Miniature ${idx + 1}-2`} className={styles.paragraphImage} />
                                        )}
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>
                    )}
                    {/* Paragraphes d'images | upload images*/}
                    <div className={styles.paragraphsSection}>
                        <label className={styles.labelParagraphs}>Paragraphes Images Uploads</label>
                        <div className={styles.paragraphsGrid}>
                            <div className={styles.miniatureSection}>
                                <h3 className={styles.miniatureTitle}>Images de paragraphe</h3>
                                <p className={styles.miniatureHelp}>
                                    Ajoutez du texte et/ou des images pour créer un nouveau paragraphe.<br />
                                    <strong>Si ni l'image de couverture ni l'image principale ne sont renseignées, la première image de paragraphe pourra être utilisée comme miniature.</strong>
                                </p>

                                {/* Champ de texte pour le paragraphe */}
                                <div style={{ marginBottom: 16 }}>
                                    <label htmlFor="paraText" className={styles.labelParagraphs}>Texte du paragraphe</label>
                                    <textarea
                                        id="paraText"
                                        placeholder="Saisissez le contenu du paragraphe..."
                                        value={paraText}
                                        onChange={e => setParaText(e.target.value)}
                                        className={styles.textareaBlockList}
                                        rows={4}
                                        style={{ width: '100%', marginTop: 8 }}
                                    />
                                </div>

                                {/* Champ pour le texte alternatif */}
                                <div style={{ marginBottom: 16 }}>
                                    <label htmlFor="paraAltText" className={styles.labelParagraphs}>Texte alternatif des images (optionnel)</label>
                                    <input
                                        id="paraAltText"
                                        type="text"
                                        placeholder="Description des images pour l'accessibilité"
                                        value={paraAltText}
                                        onChange={e => setParaAltText(e.target.value)}
                                        className={styles.inputImageName}
                                        style={{ width: '100%', marginTop: 8 }}
                                    />
                                </div>
                                <p className={styles.miniatureHelp}>
                                    Ces images sont affichées dans le corps de l’article, dans les paragraphes concernés.<br />
                                    <strong>Si ni l’image de couverture ni l’image principale ne sont renseignées, la première image de paragraphe pourra être utilisée comme miniature.</strong>
                                </p>
                                <div style={{ display: 'flex', flexDirection: 'row', gap: 24, alignItems: 'flex-start', flexWrap: 'wrap' }}>
                                    <div>
                                        <input type="file" accept="image/*" onChange={handleParaImageFileChange} className={styles.inputParagraphImage} key={paraImageName || 'para1'} />
                                        <input type="text" placeholder="Nom du fichier image 1 (optionnel)" value={paraImageName} onChange={e => setParaImageName(e.target.value)} className={styles.inputImageName} />
                                        {paraImagePreview && (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
                                                <img src={paraImagePreview} alt="Aperçu image 1" className={styles.paragraphImage} style={{ maxWidth: 120 }} />
                                                <button type="button" onClick={() => { setParaImageFile(null); setParaImagePreview(''); setParaImageName(''); }} className={styles.deleteParaImageBtn}>✕</button>
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <input type="file" accept="image/*" onChange={handleParaImageFileChange2} className={styles.inputParagraphImage2} key={paraImageName2 || 'para2'} />
                                        <input type="text" placeholder="Nom du fichier image 2 (optionnel)" value={paraImageName2} onChange={e => setParaImageName2(e.target.value)} className={styles.inputImageName} />
                                        {paraImagePreview2 && (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
                                                <img src={paraImagePreview2} alt="Aperçu image 2" className={styles.paragraphImage2} style={{ maxWidth: 120 }} />
                                                <button type="button" onClick={() => { setParaImageFile2(null); setParaImagePreview2(''); setParaImageName2(''); }} className={styles.deleteParaImageBtn}>✕</button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={styles.paragraphsBtnWrapper}>
                            <button type="button" className={styles.addParagraphBtn} onClick={handleAddParagraph}>Ajouter paragraphe</button>
                            {paraSuccess && <span className={styles.successMsg}>{paraSuccess}</span>}
                        </div>
                        <div className={styles.paragraphsListWrapper}>
                            {paragraphs.map((para, idx) => (
                                <div key={idx} className={styles.paragraphItem}>
                                    <span className={styles.paragraphItemTitle}>Paragraphe {para.ordre}</span>
                                    <div className={styles.paragraphText}>{para.texte}</div>
                                    <div className={styles.paragraphImagesRow}>
                                        {para.image_url && (
                                            <img
                                                src={para.image_url}
                                                alt={para.alt_text || "Image du paragraphe"}
                                                className={styles.paragraphImage}
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                    e.target.nextSibling.style.display = 'flex';
                                                }}
                                            />
                                        )}
                                        {para.image_url && (
                                            <div style={{
                                                display: 'none',
                                                width: '120px',
                                                height: '80px',
                                                backgroundColor: '#444',
                                                borderRadius: '4px',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: '#FFD9A0',
                                                fontSize: '12px',
                                                textAlign: 'center'
                                            }}>
                                                Image<br />indisponible
                                            </div>
                                        )}
                                        {para.image_url2 && (
                                            <img
                                                src={para.image_url2}
                                                alt={para.alt_text || "Image du paragraphe 2"}
                                                className={styles.paragraphImage2}
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                    e.target.nextSibling.style.display = 'flex';
                                                }}
                                            />
                                        )}
                                        {para.image_url2 && (
                                            <div style={{
                                                display: 'none',
                                                width: '120px',
                                                height: '80px',
                                                backgroundColor: '#444',
                                                borderRadius: '4px',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: '#FFD9A0',
                                                fontSize: '12px',
                                                textAlign: 'center'
                                            }}>
                                                Image<br />indisponible
                                            </div>
                                        )}
                                    </div>
                                    <div className={styles.paragraphActions}>
                                        <button type="button" onClick={() => handleMoveParagraph(idx, 'up')} className={styles.paragraphActionBtn} title="Monter">▲</button>
                                        <button type="button" onClick={() => handleMoveParagraph(idx, 'down')} className={styles.paragraphActionBtn} title="Descendre">▼</button>
                                        <button type="button" onClick={() => handleDeleteParagraph(idx)} className={styles.paragraphActionBtn} title="Supprimer">✕</button>
                                    </div>
                                    <div className={styles.paragraphEditGrid}>
                                        <input type="file" accept="image/*" onChange={e => handleUploadParaImage(idx, 'image_url', e)} className={styles.inputParagraphImage} key={para.image_url || `para-img1-${idx}`} />
                                        {para.image_url && (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                <img
                                                    src={para.image_url}
                                                    alt={para.alt_text || "Image du paragraphe"}
                                                    className={styles.paragraphImage}
                                                    style={{ maxWidth: 120, marginTop: 4 }}
                                                    onError={(e) => {
                                                        e.target.style.display = 'none';
                                                        e.target.nextSibling.style.display = 'flex';
                                                    }}
                                                />
                                                <div style={{
                                                    display: 'none',
                                                    width: '120px',
                                                    height: '80px',
                                                    backgroundColor: '#444',
                                                    borderRadius: '4px',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    color: '#FFD9A0',
                                                    fontSize: '12px',
                                                    textAlign: 'center',
                                                    marginTop: 4
                                                }}>
                                                    Image<br />indisponible
                                                </div>
                                                <button type="button" onClick={() => handleEditParagraph(idx, { image_url: '' })} className={styles.deleteParaImageBtn}>✕</button>
                                            </div>
                                        )}
                                        <input type="file" accept="image/*" onChange={e => handleUploadParaImage(idx, 'image_url2', e)} className={styles.inputParagraphImage2} key={para.image_url2 || `para-img2-${idx}`} />
                                        {para.image_url2 && (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                <img
                                                    src={para.image_url2}
                                                    alt={para.alt_text || "Image du paragraphe 2"}
                                                    className={styles.paragraphImage2}
                                                    style={{ maxWidth: 120, marginTop: 4 }}
                                                    onError={(e) => {
                                                        e.target.style.display = 'none';
                                                        e.target.nextSibling.style.display = 'flex';
                                                    }}
                                                />
                                                <div style={{
                                                    display: 'none',
                                                    width: '120px',
                                                    height: '80px',
                                                    backgroundColor: '#444',
                                                    borderRadius: '4px',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    color: '#FFD9A0',
                                                    fontSize: '12px',
                                                    textAlign: 'center',
                                                    marginTop: 4
                                                }}>
                                                    Image<br />indisponible
                                                </div>
                                                <button type="button" onClick={() => handleEditParagraph(idx, { image_url2: '' })} className={styles.deleteParaImageBtn}>✕</button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Navigation pagination */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 16, margin: '32px 0 0 0' }}>
                {currentStep > 0 && (
                    <button type="button" className={styles.cancelBtn} onClick={() => setCurrentStep(currentStep - 1)}>
                        Précédent
                    </button>
                )}
                {currentStep < steps.length - 1 && (
                    <button type="button" className={styles.submitBtn} onClick={() => setCurrentStep(currentStep + 1)}>
                        Suivant
                    </button>
                )}
                {currentStep === steps.length - 1 && (
                    <button type="submit" className={styles.submitBtn} disabled={loading}>
                        {loading ? 'Enregistrement...' : (mode === 'edit' ? 'Enregistrer' : 'Ajouter')}
                    </button>
                )}
                {onCancel && (
                    <button type="button" onClick={onCancel} className={styles.cancelBtn}>
                        Annuler
                    </button>
                )}
            </div>
            {/* Affichage des erreurs et succès */}
            <div style={{ marginTop: 16 }}>
                {error && <div className={styles.errorMsg}>{error}</div>}
                {success && <div className={styles.successMsg}>{success}</div>}
            </div>
            {/* Modales suppression */}
            {showDeleteModal && (
                <div className={styles.deleteModalOverlay}>
                    <div className={styles.deleteModalContent}>
                        <h3 className={styles.deleteModalTitle}>Supprimer la catégorie ?</h3>
                        <p className={styles.deleteModalText}>Cette action est irréversible.<br />Voulez-vous vraiment supprimer cette catégorie ?</p>
                        <div className={styles.deleteModalActions}>
                            <button type="button" onClick={handleDeleteCategory} className={styles.deleteModalBtn}>Supprimer</button>
                            <button type="button" onClick={closeDeleteModal} className={styles.cancelBtn}>Annuler</button>
                        </div>
                    </div>
                </div>
            )}
            {showDeleteArticleModal && (
                <div className={styles.deleteModalOverlay}>
                    <div className={styles.deleteModalContent}>
                        <h3 className={styles.deleteModalTitle}>
                            Supprimer l'article&nbsp;
                            {articleToDelete?.slug && (
                                <span style={{ color: '#FFD9A0' }}>
                                    "{articleToDelete.slug}"
                                </span>
                            )}
                            ?
                        </h3>
                        <p className={styles.deleteModalText}>Cette action est irréversible.<br />Voulez-vous vraiment supprimer cet article ?</p>
                        <div className={styles.deleteModalActions}>
                            <button type="button" onClick={handleDeleteArticle} className={styles.deleteModalBtn}>Supprimer</button>
                            <button type="button" onClick={closeDeleteArticleModal} className={styles.cancelBtn}>Annuler</button>
                        </div>
                    </div>
                </div>
            )}
        </form>
    );
}
