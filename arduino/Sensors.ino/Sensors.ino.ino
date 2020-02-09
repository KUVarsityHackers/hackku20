#include <math.h>

int pinOut = 0;
String readString = "";
String onStr = "ON";
String offStr = "OFF";
int reads = 0;
double wattHrs = 0.0;
const int analogIn = A0;
int mVperAmp = 66; // use 100 for 20A Module and 66 for 30A Module
int RawValue= 0;
int ACSoffset = 2500; 
double Voltage = 0;
double Amps = 0;
const int Sensor_Pin = A0;
unsigned int Sensitivity = 185;   // 185mV/A for 5A, 100 mV/A for 20A and 66mV/A for 30A Module
float Vpp = 0; // peak-peak voltage 
float Vrms = 0; // rms voltage
float Irms = 0; // rms current
float Supply_Voltage = 233.0;           // reading from DMM
float Vcc = 5.0;         // ADC reference voltage // voltage at 5V pin 
float power = 0;         // power in watt              
float Wh =0 ;             // Energy in kWh
unsigned long last_time =0;
unsigned long current_time =0;
unsigned long interval = 100;
unsigned int calibration = 100;  // V2 slider calibrates this
unsigned int pF = 85;           // Power Factor default 95
float bill_amount = 0;   // 30 day cost as present energy usage incl approx PF 
unsigned int energyTariff = 8.0;

int val = 0;


void getACS712() {  // for AC
  Vpp = getVPP();
  Vrms = (Vpp/2.0) *0.707; 
  Vrms = Vrms - (calibration / 10000.0);     // calibtrate to zero with slider
  Irms = (Vrms * 1000)/Sensitivity ;
  if((Irms > -0.015) && (Irms < 0.008)){  // remove low end chatter
    Irms = 0.0;
  }
  power= (Supply_Voltage * Irms) * (pF / 100.0); 
  last_time = current_time;
  current_time = millis();    
  Wh = Wh+  power *(( current_time -last_time) /3600000.0) ; // calculating energy in Watt-Hour
  bill_amount = Wh * (energyTariff/1000);
  Serial.println(String(power, 3)); 
  
}

float getVPP()
{
  float result; 
  int readValue;                
  int maxValue = 0;             
  int minValue = 1024;          
  uint32_t start_time = millis();
  while((millis()-start_time) < 2000) //read every 0.95 Sec
  {
     readValue = analogRead(Sensor_Pin);    
     if (readValue > maxValue) 
     {         
         maxValue = readValue; 
     }
     if (readValue < minValue) 
     {          
         minValue = readValue;
     }
  } 
   result = ((maxValue - minValue) * Vcc) / 1024.0;  
   return result;
 }

void setup() {
  Serial.begin(9600);
  pinMode(pinOut, OUTPUT);
  digitalWrite(pinOut, HIGH);
}
void loop() {
  if (Serial.available() > 0) {
      while (Serial.available()) {
        delay(3);  //delay to allow buffer to fill
        if (Serial.available() >0) {
          char c = Serial.read();  //gets one byte from serial buffer
          if(c != '\n') readString += c; //makes the string readString
        }
      }

      if (readString.length() >0) {
        //Serial.println(readString);
        if(readString == onStr) {
          digitalWrite(pinOut, HIGH);
          //Serial.println("Writing high");
        }
        else if(readString == offStr) {
          digitalWrite(pinOut, LOW);
          //Serial.println("Writing low");
        }
      }
      readString = "";
  }

 getACS712();
  delay(500);
}
