import {getUserData, DeleteUser} from "./database.js";
import { ñ} from './utils.js'


function Toggle(name, element) {
    let s =false
    ñ(`.r-${name}`).forEach((n)=>{
        n.hidden = !n.hidden;
        s = n.hidden;
    })
    element.classList.add(s?'sCollapsed':'sExpanded')
    element.classList.remove(s?'sExpanded':'sCollapsed')
}

function updateTable(users, values, sValues) {
    const tbody = document.getElementById("t");
    // clear existing data from tbody if it exists
    tbody.innerHTML = "";
    let p = "";
    let id =1;
    users.forEach(user => {
        p += "<tbody>";
        p += `<tr  class="blue-grey lighten-4 ${user['uid']} collapsable">`;
        p += `<td>${id++}</td>`;
        values.forEach(value => {
            p += "<td>" + (user[value] !== undefined?user[value]:"-" ) + "</td>";
        })
        p += "</tr>";



        p += `<tr class="r-${user['uid']}"><th></th><th>Registro</th><th>Win</th><th>Goles</th><th>Enviar</th><th>pass</th><th>Monto</th></tr>`;
        for (let i = 1; i <= parseInt(user['register']); i++) {
            p += `<tr  class="r-${user['uid']}">`;
            p += `<td></td>`;
            p += `<td><b>${i}</b></td>`;
            sValues.forEach(value => {
                let info = user[`${value}${i}`].toString()
                if (value === "score-"){
                    p += "<td>" + (info.split('-')[0] !== ""?info.split('-')[0]:"-" ) + "</td>"+"<td>" + (info.split('-')[0] !== ""?(info.split('-')[1])/80:"-" ) + "</td>";
                }
                else if (value === "data-"){
                    p += "<td>" + (info.split('-')[0] !== "used"?info.split('-')[0]:"-" ) + "</td>"+"<td>" + (info.split('-')[0] !== "used"?info.split('-')[1]:"used" ) + "</td>";
                }
                
                else
                    p += "<td>" + (info !== undefined?info:"-" ) + "</td>";
            })
            p += "</tr>";
        }
        p += "</tbody>";

    });

    tbody.insertAdjacentHTML("beforeend", p);
    users.forEach(user => {
        ñ(`.${user['uid']}`).forEach((n)=>{
            n.addEventListener('click', ()=> Toggle(user['uid'],n) );
        })
    });
    window.ToggleAll('sCollapsed');
}

window.ToggleAll = (s)=>{
    ñ('.collapsable').forEach((el)=>{
        if (!el.classList.contains(s))
            el.click()
    })
}
window.Reload = ()=>{
    getUserData().then((usrObj)=>{
        let users = []
        for (const u in usrObj.val()) {
            let tmp = usrObj.val()[u]
            tmp["uid"] = u;
            if (usrObj.val().hasOwnProperty(u)) 
                users.push(tmp);
        }
        ñ('#titleTable').hidden = !(users.length > 0)
        
        users.sort((a, b) => { return b.score - a.score; });
        console.log("da: ",users.length);
        updateTable(users, ['uid','username', 'email','country','register','position','company'],['score-','data-','amount-']);
        
    })
}