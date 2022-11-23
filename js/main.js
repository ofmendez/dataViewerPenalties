import {getUserData, updateMailed} from "./database.js";
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
        //ABRE MAIN-FILA
        let subP1 = `<tbody><tr  class="`
        let subP2 =  `${user['uid']} collapsable `;
        let subP3 = `"><td>${id++}</td>`;
        let mark = false
        values.forEach(value => {
            let an = value === 'uid'?'style="pointer-events:none; background-color: #b2dfdb;box-shadow: inset 0 0 0 3px teal;"':""
            subP3 += `<td ${an} >` + (user[value] !== undefined?user[value]:"-" ) + "</td>";
        })
        subP3 += "</tr>";
        //CIERRA MAIN-FILA

        //HEADER sub-tabla
        subP3 += `<tr class="r-${user['uid']}"><th></th><th>Registro</th><th>Monto</th><th>Win / Goles</th><th>Enviar</th><th>pass</th><th>reseller</th></tr>`;
        let subFila1 = ""
        let subFila2 = ""
        for (let i = 1; i <= parseInt(user['register']); i++) {
            let passSt = ""
            //ABRE SUB-FILA
            subP3 += `<tr  class="r-${user['uid']} `
            subFila2 += `   <td></td><td><b>${i}</b></td>`;
            sValues.forEach(value => {
                let info =user[`${value}${i}`]? user[`${value}${i}`].toString():""
                if (value === "score-")
                    subFila2 += "<td>" + (info.split('-')[0] !== ""?info.split('-')[0]:"-" ) + " / " + (info.split('-')[0] !== ""?(info.split('-')[1])/90:"-" ) + "</td>";
                else if (value === "data-"){
                    passSt = info.split('-')[0];
                    subFila2 += "<td>" + (passSt !== "used"?passSt:"-" ) + "</td>"+"<td>" + (passSt !== "used"?info.split('-')[1]:"used" ) + "</td>";

                }
                else if (value === "mailed-"){
                    let word = info==="disabled"?"Enviado":"Marcar"
                    // disabled
                    if(passSt === "send"){
                        subFila2 += `<td><button class="${info} waves-effect waves-light btn" onclick="window.Mark('${user['uid']}','${i}')" >${word}</button></td>`
                        subFila1 = info==="disabled"?"":"red lighten-4 "
                        mark |= info === "";
                    }
                }
                else
                    subFila2 += "<td>" + (info !== undefined?info:"-" ) + "</td>";
                })
            //CIERRA SUB-FILA
            subFila2 +=`</tr>`;
            subP3 =`${subP3} ${subFila1} ">${subFila2}`
            subFila1 =""
            subFila2 = ""
        }
        subP3 += "</tbody>";
        subP2 += `${mark?"orange lighten-4 ":"  teal lighten-2"}`
        p+= subP1+subP2+subP3;
    });

    tbody.insertAdjacentHTML("beforeend", p);
    users.forEach(user => {
        ñ(`.${user['uid']}`).forEach((n)=>{
            n.addEventListener('click', ()=> Toggle(user['uid'],n) );
        })
    });
    window.ToggleAll('sCollapsed');
}

document.getElementById('comp-l931xf92')
window.Mark = (uid,reg)=>{
    Swal.fire({
        title:'A marcar: ',
        text: 'Registro: '+reg+' |  De: '+uid+' ?',
        icon: 'warning'
    } ).then((result) => {
    /* Read more about handling dismissals below */
        if (result.isConfirmed) {
            Swal.fire({ title: 'Marcando en la base de datos', allowOutsideClick: false });
            swal.showLoading();
            updateMailed(uid,reg).then((res)=>{
                console.log(res);
                swal.close();
                Reload();
            }).catch((e)=>{
                swal.close();
                alert("Algo salió mal, no quedó marcado. "+e);
                console.log(e);
            });
        }
    })

    console.log(uid,reg);
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
        updateTable(users, ['uid','username', 'email','country','register','position','company'],['amount-','score-','data-', 'reseller-','mailed-']);
        
    })
}