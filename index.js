const express = require("express");
const mongoose = require("mongoose");
const app = express();
const bodyParser = require("body-parser");
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const uriRead = process.env.MONGODB_URI_READ;

const uriWrite = process.env.MONGODB_URI_WRITE;

const conn1 = mongoose.createConnection(uriRead, {useNewUrlParser: true});

const conn2 = mongoose.createConnection(uriWrite, {useNewUrlParser: true});

const highPulseLowPulseDataSchema = { 
   hp: String,  
   lp: String
}

const HighPulseLowPulseData = conn2.model('HighPulseLowPulseData', highPulseLowPulseDataSchema);

const tactileSensationsSchema = {
   id_tactile: String,
   tactileSensationName: String,
   textureType: String,
   highPulseMs_high_speed: String,
   lowPulseMs_high_speed: String,
   frequency_high_speed: String,
   dutyCycle_high_speed: String,
   hp_high_speed: Number,
   lp_high_speed: Number,
   highPulseMs_low_speed: String,
   lowPulseMs_low_speed: String,
   frequency_low_speed: String,
   dutyCycle_low_speed: String, 
   hp_low_speed: Number,  
   lp_low_speed: Number
}

const TactileSensation = conn1.model("TactileSensation", tactileSensationsSchema);

const absence_of_sensation = new TactileSensation({
   id_tactile: "0",
   tactileSensationName: "Absence of Sensation",
   textureType: "External movements, in texture regions, represent absence of tactile sensation",
   highPulseMs_high_speed: "0ms",
   lowPulseMs_high_speed: "0ms",
   frequency_high_speed: "0Hz",
   dutyCycle_high_speed: "0%",
   hp_high_speed: 0,
   lp_high_speed: 0,
   highPulseMs_low_speed: "0ms",
   lowPulseMs_low_speed: "0ms",
   frequency_low_speed: "0Hz",
   dutyCycle_low_speed: "0%", 
   hp_low_speed: 0,  
   lp_low_speed: 0
});

const coarse_roughness = new TactileSensation({
   id_tactile: "1",
   tactileSensationName: "Coarse Roughness",
   textureType: "Similar to contact with different thicknesses boulders",
   highPulseMs_high_speed: "45ms",
   lowPulseMs_high_speed: "94ms",
   frequency_high_speed: "7.2Hz",
   dutyCycle_high_speed: "32%",
   hp_high_speed: 173,
   lp_high_speed: 362,
   highPulseMs_low_speed: "80ms",
   lowPulseMs_low_speed: "170ms",
   frequency_low_speed: "4Hz",
   dutyCycle_low_speed: "68%", 
   hp_low_speed: 308,  
   lp_low_speed: 654
});

const fine_roughness = new TactileSensation({
   id_tactile: "2",
   tactileSensationName: "Fine Roughness",
   textureType: "Similar to contact with different thicknesses boulders",
   highPulseMs_high_speed: "22ms",
   lowPulseMs_high_speed: "42ms",
   frequency_high_speed: "15.6Hz",
   dutyCycle_high_speed: "34%",
   hp_high_speed: 85,
   lp_high_speed: 162,
   highPulseMs_low_speed: "28.33ms",
   lowPulseMs_low_speed: "55ms",
   frequency_low_speed: "12Hz",
   dutyCycle_low_speed: "34%", 
   hp_low_speed: 109,  
   lp_low_speed: 212
});

const smoothness = new TactileSensation({
   id_tactile: "3",
   tactileSensationName: "Smoothness",
   textureType: "It indicates contact with materials similar to polished wood",
   highPulseMs_high_speed: "2ms",
   lowPulseMs_high_speed: "1ms",
   frequency_high_speed: "333Hz",
   dutyCycle_high_speed: "67%",
   hp_high_speed: 8,
   lp_high_speed: 4,
   highPulseMs_low_speed: "1.38ms",
   lowPulseMs_low_speed: "1.62ms",
   frequency_low_speed: "333Hz",
   dutyCycle_low_speed: "46%", 
   hp_low_speed: 5,  
   lp_low_speed: 6
});

const softness = new TactileSensation({
   id_tactile: "4",
   tactileSensationName: "Softness",
   textureType: "Similar to the experience of running fingers over cotton",
   highPulseMs_high_speed: "1.44ms",
   lowPulseMs_high_speed: "4.56ms",
   frequency_high_speed: "166.7Hz",
   dutyCycle_high_speed: "24%",
   hp_high_speed: 6,
   lp_high_speed: 18,
   highPulseMs_low_speed: "1ms",
   lowPulseMs_low_speed: "5ms",
   frequency_low_speed: "166.7Hz",
   dutyCycle_low_speed: "16.7%", 
   hp_low_speed: 4,  
   lp_low_speed: 19
});

//absence_of_sensation.save();
//coarse_roughness.save();
//fine_roughness.save();
//smoothness.save();
//softness.save();

/*
TactileSensation.findByIdAndRemove("63f129da82a3bea1e2691429", function(err){
   if(!err){
     console.log("Tactile sensation successfully deleted.");
   }
});
*/

var oldMouseSpeedValue = 0;

var GyX;
var GyY;

var S_GyX;
var S_GyY;

var id_on_off;
var id_on_off_1 = "0";

var lock_X = false;
var lock_Y = false;

var velX;
var velY;

var velMaxActive = 2.08;//2.56;
var velMaxPassive = 600;

var hp_value; //high pulse
var lp_value; //low pulse

var hp_high_speed;  
var hp_low_speed;  
var lp_high_speed; 
var lp_low_speed;

var auxBinarySpeed;

var auxLimitedVel;

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');

//#######################################################################

app.post("/on", function(req, res){
   id_on_off = Number(req.body.btn_on_id);
   id_on_off_1 = id_on_off.toString();
   
   var activeTouch = "6\n";
   console.log("activeTouch: ", activeTouch);
   arduino.write(activeTouch); 
});

//---------------------------------------------------

app.post("/off", function(req, res){
   id_on_off = Number(req.body.btn_off_id);
   id_on_off_1 = id_on_off.toString();

   var passiveTouch = "7\n";
   console.log("passiveTouch: ", passiveTouch);
   arduino.write(passiveTouch); 
});

//#######################################################################

app.post("/zero", function(req, res){
   var num0 = Number(req.body.id_zero);
   var idTactile0 = num0.toString();
   console.log("idTactile: ", idTactile0);
   
   if(lock_X == false && lock_Y == true){ 
      activeTouchMovement(velX, idTactile0);         
   }
      
   if(lock_X == true && lock_Y == false){ 
      activeTouchMovement(velY, idTactile0);      
   }
});

//---------------------------------------------------

app.post("/one", function(req, res){
   var num1 = Number(req.body.id_one);
   var idTactile1 = num1.toString();
   console.log("idTactile: ", idTactile1);

   if(lock_X == false && lock_Y == true){ 
      activeTouchMovement(velX, idTactile1);         
   }
      
   if(lock_X == true && lock_Y == false){ 
      activeTouchMovement(velY, idTactile1);      
   }            
});

//---------------------------------------------------

app.post("/two", function(req, res){
   var num2 = Number(req.body.id_two);
   var idTactile2 = num2.toString();
   console.log("idTactile: ", idTactile2);

   if(lock_X == false && lock_Y == true){
      activeTouchMovement(velX, idTactile2); 
   }

   if(lock_X == true && lock_Y == false){
      activeTouchMovement(velY, idTactile2);   
   }       
});

//---------------------------------------------------

app.post("/three", function(req, res){
   var num3 = Number(req.body.id_three);
   var idTactile3 = num3.toString();
   console.log("idTactile: ", idTactile3);

   if(lock_X == false && lock_Y == true){
      activeTouchMovement(velX, idTactile3);
   }
      
   if(lock_X == true && lock_Y == false){
      activeTouchMovement(velY, idTactile3);
   }              
});

//---------------------------------------------------

app.post("/four", function(req, res){
   var num4 = Number(req.body.id_four);
   var idTactile4 = num4.toString();
   console.log("idTactile: ", idTactile4);

   if(lock_X == false && lock_Y == true){
      activeTouchMovement(velX, idTactile4);
   }

   if(lock_X == true && lock_Y == false){
      activeTouchMovement(velY, idTactile4);   
   }        
});

//#######################################################################

function readFromDatabase(tactile_id){
   TactileSensation.find({id_tactile: tactile_id}, function(err, tactilesensations){
      if (err) {
         console.log(err);
      }else{
         tactilesensations.forEach(function(tactilesensation){
            hp_high_speed = tactilesensation.hp_high_speed;
            hp_low_speed = tactilesensation.hp_low_speed;
            lp_high_speed = tactilesensation.lp_high_speed;
            lp_low_speed = tactilesensation.lp_low_speed;   
         });
      }    
   });
}
//-------------------------------------------------------------------------
function highPulse(vel, velMax, hp_high_speed, hp_low_speed){
   var limitedVelValue = limitedVel(vel, velMax);
   var velActivePassive = limitedVelValue/velMax;
   var hp = binarySpeed(velActivePassive)*hp_low_speed+velActivePassive*(hp_high_speed-hp_low_speed);
   return hp;
}
//-------------------------------------------------------------------------
function lowPulse(vel, velMax, lp_high_speed, lp_low_speed){
   var limitedVelValue = limitedVel(vel, velMax);
   var velActivePassive = limitedVelValue/velMax;
   var lp = binarySpeed(velActivePassive)*lp_low_speed+velActivePassive*(lp_high_speed-lp_low_speed);
   return lp;
}
//-------------------------------------------------------------------------
function limitedVel(vel, velMax){
   if(vel >= velMax){
      auxLimitedVel = velMax;
   }
   if(vel < velMax){
      auxLimitedVel = vel;
   }
   
   return auxLimitedVel;
}
//-------------------------------------------------------------------------
function binarySpeed(vel){
   if(vel == 0){
      auxBinarySpeed = 0;
   }

   if(vel > 0){
      auxBinarySpeed = 1;
   }
   return auxBinarySpeed;
}

//#######################################################################

function sendTactileSensation(vel, velMax, idTactile){
   readFromDatabase(idTactile);
         
   hp_value = Math.round(highPulse(vel, velMax, hp_high_speed, hp_low_speed) + 2000);
   lp_value = Math.round(lowPulse(vel, velMax, lp_high_speed, lp_low_speed) + 9000);

   /*
   hp_value = hp_value - 2000
   lp_value = lp_value - 9000
   */

   console.log("limitedSpeed: ", auxLimitedVel);

   console.log("v_high: ", hp_value.toString());
   console.log("v_low: ", lp_value.toString() + "\n");

   /*
   arduino.write(hp_value.toString() + "\n");
   arduino.write(lp_value.toString() + "\n");
   */

   var hp = hp_value.toString() + "\n";
   var lp = lp_value.toString() + "\n";

   HighPulseLowPulseData.findByIdAndUpdate("6436ece67c7d81b9fb201970", { hp: hp }, function(err){
      if (err){
         console.log(err);
      }
   });

   HighPulseLowPulseData.findByIdAndUpdate("6436ece67c7d81b9fb201970", { lp: lp }, function(err){
      if (err){
         console.log(err);
      }
   });   
}

//#######################################################################

function activeTouchMovement(vel, idTactile){
   console.log("speedValue: ", vel);

   sendTactileSensation(vel, velMaxActive, idTactile);
}
//-------------------------------------------------------------------------
io.on('connection', (socket) => {
   socket.on('mouse_speed_track', function(speed_value, idTactile){
      if(oldMouseSpeedValue == 0 || speed_value == oldMouseSpeedValue){
         oldMouseSpeedValue = speed_value;
      }else if(speed_value != oldMouseSpeedValue){
         oldMouseSpeedValue = speed_value;
         console.log("speedValue: ", speed_value);
         console.log("idTactile: ", idTactile);

         sendTactileSensation(speed_value, velMaxPassive, idTactile);
      }
   });
     
   socket.on('disconnect', function(){
      //console.log('user disconnected');
   });
});       

//#######################################################################

function main(){

   app.use('/Tactile_Glove_Experiment_QoE', express.static(__dirname + '/Tactile_Glove_Experiment_QoE'));
   app.use('/dist', express.static(__dirname + '/dist'));
   app.get("/", function(req, res){
      res.render("indeex", {});
   });
   app.get("/views/indeex.ejs", function(req, res){
      res.render("indeex", {}); 
   });
   app.get("/views/camisabasica.ejs", function(req, res){
      res.render("camisabasica", {val_X: GyX, val_Y: GyY, val_ON_OFF: id_on_off_1, S_val_X: S_GyX, S_val_Y: S_GyY});  
   });
   app.get("/views/camisapolo.ejs", function(req, res){
      res.render("camisapolo", {val_X: GyX, val_Y: GyY, val_ON_OFF: id_on_off_1, S_val_X: S_GyX, S_val_Y: S_GyY});  
   });
   app.get("/views/casacoalgodao1.ejs", function(req, res){
      res.render("casacoalgodao1", {val_X: GyX, val_Y: GyY, val_ON_OFF: id_on_off_1, S_val_X: S_GyX, S_val_Y: S_GyY}); 
   });
   app.get("/views/casacoalgodao2.ejs", function(req, res){
      res.render("casacoalgodao2", {val_X: GyX, val_Y: GyY, val_ON_OFF: id_on_off_1, S_val_X: S_GyX, S_val_Y: S_GyY});  
   });
   app.get("/views/casacocroche1.ejs", function(req, res){
      res.render("casacocroche1", {val_X: GyX, val_Y: GyY, val_ON_OFF: id_on_off_1, S_val_X: S_GyX, S_val_Y: S_GyY});  
   });
   app.get("/views/casacocroche2.ejs", function(req, res){
      res.render("casacocroche2", {val_X: GyX, val_Y: GyY, val_ON_OFF: id_on_off_1, S_val_X: S_GyX, S_val_Y: S_GyY});  
   });
   app.get("/views/casacocroche3.ejs", function(req, res){
      res.render("casacocroche3", {val_X: GyX, val_Y: GyY, val_ON_OFF: id_on_off_1, S_val_X: S_GyX, S_val_Y: S_GyY});  
   });
   app.get("/views/casacocroche4.ejs", function(req, res){
      res.render("casacocroche4", {val_X: GyX, val_Y: GyY, val_ON_OFF: id_on_off_1, S_val_X: S_GyX, S_val_Y: S_GyY});  
   });
   app.get("/views/roupajeans.ejs", function(req, res){
      res.render("roupajeans", {val_X: GyX, val_Y: GyY, val_ON_OFF: id_on_off_1, S_val_X: S_GyX, S_val_Y: S_GyY});  
   });
   app.get("/views/salto.ejs", function(req, res){
      res.render("salto", {val_X: GyX, val_Y: GyY, val_ON_OFF: id_on_off_1, S_val_X: S_GyX, S_val_Y: S_GyY});  
   });
   app.get("/views/sandalia_amarela.ejs", function(req, res){
      res.render("sandalia_amarela", {val_X: GyX, val_Y: GyY, val_ON_OFF: id_on_off_1, S_val_X: S_GyX, S_val_Y: S_GyY});  
   });
   app.get("/views/sueter1.ejs", function(req, res){
      res.render("sueter1", {val_X: GyX, val_Y: GyY, val_ON_OFF: id_on_off_1, S_val_X: S_GyX, S_val_Y: S_GyY});  
   });
   app.get("/views/sueter2.ejs", function(req, res){
      res.render("sueter2", {val_X: GyX, val_Y: GyY, val_ON_OFF: id_on_off_1, S_val_X: S_GyX, S_val_Y: S_GyY});  
   });
   app.get("/views/sueter3.ejs", function(req, res){
      res.render("sueter3", {val_X: GyX, val_Y: GyY, val_ON_OFF: id_on_off_1, S_val_X: S_GyX, S_val_Y: S_GyY});  
   });
   app.get("/views/tenis.ejs", function(req, res){
      res.render("tenis", {val_X: GyX, val_Y: GyY, val_ON_OFF: id_on_off_1, S_val_X: S_GyX, S_val_Y: S_GyY});  
   });
   app.get("/cadastro.html", function(req, res){
      res.sendFile(__dirname + "/cadastro.html");  
   });
   app.get("/camisas.html", function(req, res){
      res.sendFile(__dirname + "/camisas.html");  
   });
   app.get("/carrinho.html", function(req, res){
      res.sendFile(__dirname + "/carrinho.html");  
   });
   app.get("/casacos.html", function(req, res){
      res.sendFile(__dirname + "/casacos.html");  
   });
   app.get("/conta.html", function(req, res){
      res.sendFile(__dirname + "/conta.html");  
   });
   app.get("/contaconfirmada.html", function(req, res){
      res.sendFile(__dirname + "/contaconfirmada.html");  
   });
   app.get("/crochê.html", function(req, res){
      res.sendFile(__dirname + "/crochê.html");  
   });
   app.get("/jeans.html", function(req, res){
      res.sendFile(__dirname + "/jeans.html");  
   });
   app.get("/login.html", function(req, res){
      res.sendFile(__dirname + "/login.html");  
   });
   app.get("/sobre.html", function(req, res){
      res.sendFile(__dirname + "/sobre.html");  
   });   
}

// set an interval to update 2 times per second:
setInterval(main, 500);

//#######################################################################

server.listen(3000, function(){   
  console.log("Server is running on port 3000");
});














