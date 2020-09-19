const sworm = require('sworm');
const Users = require('../models/users.model');
const { requiresAuth } = require('../app-setting')

doesUserHavePermission = async (userInfo, permission, access) => {

    if (!requiresAuth)
        return { message: '', result: true, statusCode: '' };

   // console.log('check1',userInfo);
    try {
       // let userInfo = await Users.findOne({ _id: user._id });
        if (userInfo) {
            if (userInfo.userType === "Admin")
                return { message: '', result: true, statusCode: '' };
            if (!userInfo.isActive)
                return { message: 'اکانت مورد نظر غیر فعال می باشد', result: false, statusCode: 200 };

            if (access === "Damage" || access === "Statistics") {
                const userPermission = userInfo.permissions.filter(c => (c.name === "Vessel" || c.name === "Gate" || c.name === "CY") && c.isGranted === true);
                if (userPermission && userPermission.length >= 1) {
                    return { message: '', result: true, statusCode: '' };
                }
                return { message: "Access to the part has been forbidden", result: false, statusCode: 403 };
            }
            else {
                const userPermission = userInfo.permissions.filter(c => c.name === permission && c.isGranted === true);
                if (userPermission && userPermission.length === 1) {
                    const userAccess = userPermission[0].access.filter(c => c.key === access && c.value === true);
                    //console.log('check2',userPermission, userAccess, user, permission, access);
                    if (userAccess && userAccess.length === 1) {
                        return { message: '', result: true, statusCode: '' };
                    }
                }
                return { message: "Access to the part has been forbidden", result: false, statusCode: 403 };
            }
        }
        else {
            return { message: "User not found", result: false, statusCode: 401 };
        }
    } catch (error) {
        return { message: `check permission(${user.id},${permission},${access}`, result: false, statusCode: 500 };
    }
}

module.exports = {
    DoesUserHavePermission: doesUserHavePermission
}

