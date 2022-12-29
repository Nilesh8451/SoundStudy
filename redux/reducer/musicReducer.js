const initialState = {
  musics: [],
};

export const MusicReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'ADD_SONG':
      return {
        ...state,
        musics: [...state.musics, action.data],
      };

    default: {
      return state;
    }
  }
};
