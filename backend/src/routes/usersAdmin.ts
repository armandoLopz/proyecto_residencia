import express from 'express';
import Users from '../models/User';
import Residents from '../models/Resident';
import Owners from '../models/Owner';

const router = express.Router();
export default router.get('/', async(_req,res)=> {
    
    try {
        
        const users = await Users.findAll();
        res.send(users);

    } catch (error) {
        
        console.log(error);
    }
})

router.post("/new", async (req,res) => {
    
    try {
        
        const checkUserByEmail = await Users.findOne({ where: { email: req.body.email } });
        const checkUserByCI = await Users.findOne({ where: { ci: req.body.ci } });
        
        if (checkUserByCI) {
        
            return res.status(400).send({ message: "Ya hay un usuario registrado con la cedula introducida" });
        
        }else if (checkUserByEmail) {
            
            return res.status(400).send({ message: "Ya hay un usuario registrado con el correo intoducido" });
        }
        
        const user = await Users.create(req.body);
        //const userData: JSON = JSON.parse(req.body)
        //console.log(userData);

        
        // DEPENDIENDO DEL TIPO DE ROLE ENVIARA UN TIPO DE USUARIO DISTINTO COMO RESPUESTA
        if (req.body.user_role == "resident") {

            const residentData = {

                user: user.ci,
                apartment_n: req.body.apartment_n
            }

            user.save();
            const fin = await Users.findOne({ where: { ci: req.body.ci } });
            console.log("TIPO DE DATO DE LA ASOCIACION  " + typeof user.ci);
            
            console.log("USUARIO CREADO");
            
            console.log(fin);
            
            const resident = await Residents.create(residentData);
            return res.send(resident);
        
        }else if (req.body.user_role == "owner") {
            
            const residentData = {

                user: user.ci,
                apartment_n: req.body.apartment_n
            }

            user.save();
            const fin = await Users.findOne({ where: { ci: req.body.ci } });
            console.log("TIPO DE DATO DE LA ASOCIACION  " + typeof user.ci);
            console.log(fin);
            
            const owner = await Owners.create(residentData);
            return res.send(owner);
        }

        user.save();
        return res.status(201).send(user);


    } catch (error) {
        
        console.log(error);
        
        res.status(400).send(error);
    }

});

router.patch("/modify/:userId", async (req,res) => {
    
    try {

        const userId = req.params.userId
        const userToUpdate = await Users.findByPk(userId);

        const updateData = req.body;

        //DEFINIR SI HAY OTRO TIPO DE DATO A CAMBIAR EN LOS USUARIOS

        if (userToUpdate && updateData.email) {
            userToUpdate.email = updateData.email;
            
            await userToUpdate.save();
            res.status(201).send(userToUpdate);
        }


    } catch (error) {
        
        console.log(error);
        
        res.status(400).send(error);
    }

});

router.delete("/delete/:userId", async (req,res) => {
    
    try {

        const userId = req.params.userId
        const userDelete = await Users.findByPk(userId);
        console.log(userId);
        console.log(typeof userId);
        
        
        
        if (userDelete != null) {
            await Users.destroy({ where: { user_id : userId } });

        }else{

            return res.send(404).send({message: 'ID is not asociate a any user'})    
        }

        res.send(200).send(userDelete)


    } catch (error) {
        
        console.log(error);
        
        res.status(400).send(error);
    }

});