    import {loadViewFile} from './files.js'

    const content = document.getElementById('bodyId');
    const view = function(textView) {
        content.innerHTML = textView;
    }
    const PageState = function() {
        let currentState = new view("");
        this.change = state => currentState = state;
    }
    const page = new PageState();
    
    export const GoTo = (viewName) => {
        return new Promise((resolve,reject)=>{
            loadViewFile(viewName).then((res)=>{
                window.history.pushState({}, document.title, window.location.pathname);
                page.change(new view(res));
                resolve(viewName);
            } );
        });
    }
     export const viewAv = ['Login','TerminosYCondiciones','Felicitaciones','SigueIntentando']
     export const viewDat = {'Rango1': 3, 'Rango2' : 5 , 'Rango3': 6}
     export const viewDat2 = {'Rango1': 230, 'Rango2' : 345 , 'Rango3': 345}
     export const viewDat3 = {'Rango1': 20, 'Rango2' : 30 , 'Rango3': 50}
