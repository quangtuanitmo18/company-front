import { createStore } from "vuex";
import auth from "./modules/auth";
import settings from "./modules/settings.js";
import audio from "./modules/audio.js";


export default createStore({
    modules: {
        auth,
        settings,
        audio
    }
})