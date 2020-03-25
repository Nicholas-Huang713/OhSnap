const currentPage = (state = "", action) => {
    switch(action.type){
        case 'HOME':
            state = "home";
            break;
        case 'ALBUM':
            state = "album";
            break;
        case 'LOGIN':
            state = "login";
            break;
        case 'REGISTER':
            state = "register";
            break;
        case 'DASHBOARD':
            state = "dashboard";
            break;
        case 'FAVORITES':
            state = "favorites";
            break;
        default: 
            return state;
    }
    return state;
}

export default currentPage;