import styled from 'styled-components'

export const ComposantMoveListe = styled.section`
height: 100vh:
width: 100vw;
padding: 80px;
display: flex;
align-items: center;
justify-content: center;
flex-direction: column;
background: red;

/* MovieList.css */
.movie-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 20vw;
  margin: 5px 0;
}

.movie-link {
  /* Ajoutez ici les styles pour le lien du film si nécessaire */
}

.favorite-button {
    display: flex;
    justify-content: flex-end; /* Alignez le contenu à droite */
    align-items: center;
    padding: 0; /* Retirer le padding si nécessaire */
    border: none;
    background: none;
    cursor: pointer;
  }

.favorite-icon {
  margin: 0 20px 0 0; /* Ajoutez une marge à droite de l'icône */

}

`

