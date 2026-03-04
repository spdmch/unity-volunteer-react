import { useState, useEffect } from 'react';
import { doc, setDoc, getDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../Context/AuthContext';
import { Link } from 'react-router-dom';

function StarRating({ initiativeId }) {
  const { currentUser } = useAuth();

  const [userRating,    setUserRating]    = useState(0);
  const [avgRating,     setAvgRating]     = useState(0);
  const [totalRatings,  setTotalRatings]  = useState(0);
  const [hovered,       setHovered]       = useState(0);
  const [loading,       setLoading]       = useState(false);

  useEffect(() => {
    async function fetchRatings() {
      const ratingsRef = collection(db, 'initiatives', initiativeId, 'ratings');
      const snapshot   = await getDocs(ratingsRef);
      const values     = snapshot.docs.map((d) => d.data().value);

      if (values.length > 0) {
        const avg = values.reduce((a, b) => a + b, 0) / values.length;
        setAvgRating(Math.round(avg * 10) / 10);
        setTotalRatings(values.length);
      }

      if (currentUser) {
        const userRef = doc(db, 'initiatives', initiativeId, 'ratings', currentUser.uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          setUserRating(userDoc.data().value);
        }
      }
    }

    fetchRatings();
  }, [initiativeId, currentUser]);

  async function handleRate(star) {
    if (!currentUser || loading) return;
    setLoading(true);
    try {
      const ratingRef = doc(db, 'initiatives', initiativeId, 'ratings', currentUser.uid);
      await setDoc(ratingRef, {
        value:     star,
        userId:    currentUser.uid,
        userEmail: currentUser.email,
        createdAt: new Date(),
      });
      setUserRating(star);

      const ratingsRef = collection(db, 'initiatives', initiativeId, 'ratings');
      const snapshot   = await getDocs(ratingsRef);
      const values     = snapshot.docs.map((d) => d.data().value);
      const avg        = values.reduce((a, b) => a + b, 0) / values.length;
      setAvgRating(Math.round(avg * 10) / 10);
      setTotalRatings(values.length);
    } catch (err) {
      console.error('Помилка збереження оцінки:', err);
    } finally {
      setLoading(false);
    }
  }

  const displayStars = hovered || userRating;

  return (
    <div className="star-rating">

      {totalRatings > 0 && (
        <p className="star-avg">
          ★ {avgRating} <span className="star-count">({totalRatings})</span>
        </p>
      )}

      {currentUser ? (
        <div className="star-input">
          <span className="star-label">
            {userRating ? 'Ваша оцінка:' : 'Оцінити:'}
          </span>
          <div className="stars">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className={`star${star <= displayStars ? ' star--on' : ''}`}
                onClick={() => handleRate(star)}
                onMouseEnter={() => setHovered(star)}
                onMouseLeave={() => setHovered(0)}
                disabled={loading}
                aria-label={`${star} зірок`}
              >
                ★
              </button>
            ))}
          </div>
        </div>
      ) : (
        <p className="star-hint">
          <Link to="/login">Увійдіть</Link>, щоб оцінити ініціативу
        </p>
      )}

    </div>
  );
}

export default StarRating;