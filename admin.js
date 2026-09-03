// ======================================================
// ADMIN PANEL JS
// ======================================================


console.log("Admin JS Loaded");


// API
const ADMIN_API = `${API_URL}/admin`;



// عناصر صفحه

const totalUsers =
document.getElementById("totalUsers");


const verifiedUsers =
document.getElementById("verifiedUsers");


const latestUser =
document.getElementById("latestUser");


const adminUsersList =
document.getElementById("adminUsersList");


const refreshUsersBtn =
document.getElementById("refreshUsersBtn");


const usersStatus =
document.getElementById("usersStatus");





// ======================================================
// LOAD USERS
// ======================================================


async function loadUsers(){


    try{


        usersStatus.innerHTML =
        `
        <strong>
        در حال دریافت اطلاعات...
        </strong>
        `;



        console.log(
            "GET:",
            `${ADMIN_API}/users`
        );



        const response =
        await fetch(
            `${ADMIN_API}/users`
        );




        const text =
        await response.text();



        console.log(
            "SERVER RESPONSE:",
            text
        );



        let data;


        try{

            data =
            JSON.parse(text);

        }
        catch{

            throw new Error(
                "پاسخ سرور JSON نیست"
            );

        }



        if(!response.ok){

            throw new Error(
                data.message ||
                "خطا در دریافت کاربران"
            );

        }




        renderUsers(
            data.users || []
        );



        totalUsers.textContent =
        data.count || 0;




        const verified =
        (data.users || [])
        .filter(
            user=>user.verified
        )
        .length;



        verifiedUsers.textContent =
        verified;




        if(data.users.length){


            latestUser.textContent =
            data.users[0].fullname ||
            data.users[0].phone;


        }
        else{

            latestUser.textContent =
            "-";

        }





        usersStatus.innerHTML =
        `

        <strong>
        اطلاعات کاربران دریافت شد ✓
        </strong>

        <span>
        ${data.count} حساب پیدا شد
        </span>

        `;



    }
    catch(error){


        console.log(
            "ADMIN ERROR:",
            error
        );



        usersStatus.innerHTML =
        `

        <strong>
        خطا در دریافت اطلاعات ❌
        </strong>

        `;


    }


}








// ======================================================
// RENDER USERS
// ======================================================



function renderUsers(users){


    adminUsersList.innerHTML="";



    users.forEach(user=>{



        const card =
        document.createElement(
            "div"
        );



        card.className =
        "admin-user-card";



        card.innerHTML =

        `

        <h3>
        ${user.fullname || "بدون نام"}
        </h3>


        <p>
        📧 ${user.email || "-"}
        </p>


        <p>
        📱 ${user.phone || "-"}
        </p>


        <p>
        🤖 شناسه روبیکا:
        ${user.chatId || "-"}
        </p>


        <p>

        وضعیت:

        ${
            user.verified
            ?
            "تایید شده ✅"
            :
            "تایید نشده ❌"
        }

        </p>



        <button
        class="delete-user-btn"
        data-id="${user._id}"
        >

        🗑 حذف حساب

        </button>


        `;




        adminUsersList.appendChild(card);



    });




    document
    .querySelectorAll(".delete-user-btn")
    .forEach(btn=>{


        btn.addEventListener(
            "click",
            ()=>{

                deleteUser(
                    btn.dataset.id
                );

            }
        );


    });


}








// ======================================================
// DELETE USER
// ======================================================



async function deleteUser(id){


    if(
        !confirm(
        "آیا حذف شود؟"
        )
    )
    return;




    try{


        const response =
        await fetch(

            `${ADMIN_API}/users/${id}`,

            {

                method:"DELETE"

            }

        );



        const data =
        await response.json();




        if(response.ok){


            alert(
                "کاربر حذف شد"
            );


            loadUsers();


        }
        else{


            alert(
                data.message ||
                "خطا در حذف"
            );


        }



    }
    catch(error){


        console.log(
            error
        );


        alert(
            "اتصال به سرور مشکل دارد"
        );


    }


}







// ======================================================
// REFRESH
// ======================================================



if(refreshUsersBtn){


refreshUsersBtn.addEventListener(
"click",
loadUsers
);


}





// شروع

loadUsers();