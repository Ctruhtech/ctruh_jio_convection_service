// import connectDB from "./config/db";
// import { Stall } from "./models/stall";
// import crypto from "crypto";
// export const createStall = async () => {
//   console.log("1st");
//   try {
//     connectDB()
//       .then(async () => {
//         try {
//           console.log("2nd");
//           const array = [
//             { name: "A01", wallsCount: 2, zone: 1 },
//             { name: "A02", wallsCount: 2, zone: 1 },
//             { name: "A03", wallsCount: 2, zone: 1 },
//             { name: "A04", wallsCount: 2, zone: 1 },
//             { name: "A05", wallsCount: 2, zone: 1 },
//             { name: "A06", wallsCount: 2, zone: 1 },
//             { name: "A07", wallsCount: 2, zone: 1 },
//             { name: "A08", wallsCount: 2, zone: 1 },
//             { name: "A09", wallsCount: 2, zone: 1 },
//             { name: "A10", wallsCount: 2, zone: 1 },
//             { name: "A11", wallsCount: 2, zone: 1 },
//             { name: "A12", wallsCount: 3, zone: 1 },
//             { name: "A14", wallsCount: 2, zone: 1 },
//             { name: "B01", wallsCount: 2, zone: 4 },
//             { name: "B02", wallsCount: 3, zone: 4 },
//             { name: "B03", wallsCount: 3, zone: 4 },
//             { name: "B04", wallsCount: 3, zone: 4 },
//             { name: "B05", wallsCount: 2, zone: 4 },
//             { name: "B06", wallsCount: 2, zone: 4 },
//             { name: "B06A", wallsCount: 3, zone: 4 },
//             { name: "B07", wallsCount: 3, zone: 4 },
//             { name: "B08", wallsCount: 3, zone: 4 },
//             { name: "B09", wallsCount: 3, zone: 4 },
//             { name: "B10", wallsCount: 2, zone: 4 },
//             { name: "B12", wallsCount: 2, zone: 4 },
//             { name: "B14", wallsCount: 3, zone: 4 },
//             { name: "B15", wallsCount: 3, zone: 4 },
//             { name: "B16", wallsCount: 3, zone: 4 },
//             { name: "B17", wallsCount: 3, zone: 4 },
//             { name: "C01", wallsCount: 2, zone: 4 },
//             { name: "C02", wallsCount: 3, zone: 4 },
//             { name: "C03", wallsCount: 3, zone: 4 },
//             { name: "C04", wallsCount: 3, zone: 4 },
//             { name: "C05", wallsCount: 3, zone: 4 },
//             { name: "C06", wallsCount: 3, zone: 4 },
//             { name: "C07", wallsCount: 3, zone: 4 },
//             { name: "C08", wallsCount: 3, zone: 4 },
//             { name: "C09", wallsCount: 2, zone: 4 },
//             { name: "C10", wallsCount: 2, zone: 4 },
//             { name: "C11", wallsCount: 2, zone: 4 },
//             { name: "C12", wallsCount: 3, zone: 4 },
//             { name: "C14", wallsCount: 3, zone: 4 },
//             { name: "C15", wallsCount: 3, zone: 4 },
//             { name: "C17", wallsCount: 3, zone: 4 },
//             { name: "C18", wallsCount: 2, zone: 4 },
//             { name: "D01", wallsCount: 2, zone: 4 },
//             { name: "D02", wallsCount: 3, zone: 4 },
//             { name: "D03A", wallsCount: 3, zone: 4 },
//             { name: "D03", wallsCount: 3, zone: 4 },
//             { name: "D04", wallsCount: 3, zone: 4 },
//             { name: "D05", wallsCount: 3, zone: 4 },
//             { name: "D06", wallsCount: 3, zone: 4 },
//             { name: "D06A", wallsCount: 3, zone: 4 },
//             { name: "D07", wallsCount: 3, zone: 4 },
//             { name: "D08", wallsCount: 3, zone: 4 },
//             { name: "D11", wallsCount: 2, zone: 4 },
//             { name: "D12", wallsCount: 2, zone: 4 },
//             { name: "D12A", wallsCount: 3, zone: 4 },
//             { name: "D14", wallsCount: 3, zone: 4 },
//             { name: "D15", wallsCount: 3, zone: 4 },
//             { name: "D16", wallsCount: 3, zone: 4 },
//             { name: "D17", wallsCount: 3, zone: 4 },
//             { name: "D18", wallsCount: 3, zone: 4 },
//             { name: "D19", wallsCount: 3, zone: 4 },
//             { name: "D20", wallsCount: 3, zone: 4 },
//             { name: "D21", wallsCount: 3, zone: 4 },
//             { name: "D22", wallsCount: 3, zone: 4 },
//             { name: "D23", wallsCount: 3, zone: 4 },
//             { name: "D24", wallsCount: 2, zone: 4 },
//             { name: "E1", wallsCount: 2, zone: 2 },
//             { name: "E2", wallsCount: 3, zone: 2 },
//             { name: "E3", wallsCount: 3, zone: 2 },
//             { name: "E05", wallsCount: 2, zone: 3 },
//             { name: "E05A", wallsCount: 4, zone: 3 },
//             { name: "E05B", wallsCount: 3, zone: 3 },
//             { name: "E7", wallsCount: 2, zone: 3 },
//             { name: "E10A", wallsCount: 3, zone: 2 },
//             { name: "E11", wallsCount: 3, zone: 2 },
//             { name: "E12", wallsCount: 2, zone: 2 },
//             { name: "F01", wallsCount: 2, zone: 2 },
//             { name: "F02", wallsCount: 3, zone: 2 },
//             { name: "F03", wallsCount: 3, zone: 2 },
//             { name: "F04", wallsCount: 2, zone: 2 },
//             { name: "F05", wallsCount: 2, zone: 3 },
//             { name: "F06", wallsCount: 3, zone: 3 },
//             { name: "F07", wallsCount: 2, zone: 3 },
//             { name: "F08", wallsCount: 2, zone: 3 },
//             { name: "F09", wallsCount: 3, zone: 3 },
//             { name: "F09A", wallsCount: 3, zone: 3 },
//             { name: "F10", wallsCount: 3, zone: 3 },
//             { name: "F10A", wallsCount: 2, zone: 3 },
//             { name: "F11", wallsCount: 3, zone: 2 },
//             { name: "F12", wallsCount: 3, zone: 2 },
//             { name: "F14", wallsCount: 2, zone: 2 },
//             { name: "F15", wallsCount: 2, zone: 2 },
//             { name: "G01", wallsCount: 2, zone: 3 },
//             { name: "G02", wallsCount: 3, zone: 3 },
//             { name: "G03", wallsCount: 3, zone: 3 },
//             { name: "G04", wallsCount: 3, zone: 3 },
//             { name: "G04A", wallsCount: 2, zone: 3 },
//             { name: "G05", wallsCount: 2, zone: 3 },
//             { name: "G06", wallsCount: 3, zone: 3 },
//             { name: "G07", wallsCount: 3, zone: 3 },
//             { name: "G09", wallsCount: 2, zone: 3 },
//             { name: "H01", wallsCount: 2, zone: 3 },
//             { name: "H02", wallsCount: 3, zone: 3 },
//             { name: "H03", wallsCount: 3, zone: 3 },
//             { name: "H04", wallsCount: 1, zone: 3 },
//             { name: "H06", wallsCount: 3, zone: 3 },
//             { name: "H07", wallsCount: 3, zone: 3 },
//             { name: "H08", wallsCount: 2, zone: 3 },
//             { name: "I01", wallsCount: 2, zone: 3 },
//             { name: "I02", wallsCount: 3, zone: 3 },
//             { name: "I03A", wallsCount: 3, zone: 3 },
//             { name: "I03", wallsCount: 2, zone: 3 },
//             { name: "I04", wallsCount: 2, zone: 3 },
//             { name: "I05", wallsCount: 3, zone: 3 },
//             { name: "I06", wallsCount: 3, zone: 3 },
//             { name: "I09", wallsCount: 2, zone: 3 },
//             { name: "J02", wallsCount: 3, zone: 3 },
//             { name: "J03", wallsCount: 3, zone: 3 },
//             { name: "J04", wallsCount: 3, zone: 3 },
//             { name: "J05", wallsCount: 2, zone: 3 },
//             { name: "J06", wallsCount: 2, zone: 3 },
//             { name: "J07", wallsCount: 3, zone: 3 },
//             { name: "J08", wallsCount: 3, zone: 3 },
//             { name: "J09", wallsCount: 3, zone: 3 },
//             { name: "J10", wallsCount: 2, zone: 3 },
//             { name: "K01", wallsCount: 2, zone: 3 },
//             { name: "K02", wallsCount: 3, zone: 3 },
//             { name: "K03", wallsCount: 3, zone: 3 },
//             { name: "K04", wallsCount: 2, zone: 3 },
//             { name: "K05", wallsCount: 2, zone: 3 },
//             { name: "K07", wallsCount: 3, zone: 3 },
//             { name: "K08", wallsCount: 3, zone: 3 },
//             { name: "K10", wallsCount: 2, zone: 3 },
//             { name: "L01", wallsCount: 2, zone: 1 },
//             { name: "L01A", wallsCount: 2, zone: 1 },
//             { name: "L02", wallsCount: 2, zone: 1 },
//             { name: "L02A", wallsCount: 2, zone: 1 },
//             { name: "L03", wallsCount: 2, zone: 2 },
//             { name: "L04", wallsCount: 3, zone: 2 },
//             { name: "L05", wallsCount: 3, zone: 2 },
//             { name: "L07", wallsCount: 2, zone: 2 },
//             { name: "L08", wallsCount: 2, zone: 2 },
//             { name: "L09", wallsCount: 3, zone: 2 },
//             { name: "L10", wallsCount: 3, zone: 2 },
//             { name: "L11", wallsCount: 3, zone: 2 },
//             { name: "L12", wallsCount: 2, zone: 2 },
//             { name: "R01", wallsCount: 2, zone: 2 },
//             { name: "R02", wallsCount: 3, zone: 2 },
//             { name: "R03", wallsCount: 2, zone: 2 },
//             { name: "R06", wallsCount: 2, zone: 2 },
//             { name: "R07", wallsCount: 3, zone: 2 },
//             { name: "R08", wallsCount: 2, zone: 2 },
//             { name: "R09", wallsCount: 2, zone: 2 },
//             { name: "R10", wallsCount: 3, zone: 2 },
//             { name: "R11", wallsCount: 3, zone: 2 },
//             { name: "R12", wallsCount: 2, zone: 2 },
//             { name: "R14", wallsCount: 2, zone: 2 },
//             { name: "R15", wallsCount: 3, zone: 2 },
//             { name: "R16", wallsCount: 3, zone: 2 },
//             { name: "R17", wallsCount: 3, zone: 2 },
//             { name: "R17A", wallsCount: 2, zone: 2 },
//             { name: "R18", wallsCount: 2, zone: 2 },
//             { name: "R19", wallsCount: 3, zone: 2 },
//             { name: "R20", wallsCount: 3, zone: 2 },
//             { name: "R21", wallsCount: 2, zone: 2 },
//             { name: "R23", wallsCount: 3, zone: 2 },
//             { name: "R29", wallsCount: 1, zone: 2 },
//             { name: "R31", wallsCount: 3, zone: 2 },
//             { name: "R32", wallsCount: 2, zone: 2 },
//             { name: "R33", wallsCount: 2, zone: 2 },
//             { name: "R34", wallsCount: 3, zone: 2 },
//             { name: "R35", wallsCount: 3, zone: 2 },
//             { name: "R37", wallsCount: 2, zone: 2 },
//             { name: "R38", wallsCount: 3, zone: 2 },
//             { name: "R40", wallsCount: 3, zone: 2 },
//             { name: "R42", wallsCount: 3, zone: 2 },
//             { name: "R43", wallsCount: 3, zone: 2 },
//             { name: "R44", wallsCount: 2, zone: 2 },
//           ];

//           for (let index = 0; index < array.length; index++) {
//             const stallObject = array[index];

//             // Generate a unique 8-character alphanumeric code
//             const uniqueCode = crypto
//               .randomBytes(4)
//               .toString("hex")
//               .toUpperCase(); // 8 characters

//             // Create a new stall with 'isAvailable' set to true by default, and other fields
//             const newStall = new Stall({
//               name: stallObject.name,
//               isAvailable: true,
//               zone: stallObject.zone,
//               uniqueCode,
//               wallsCount: stallObject.wallsCount,
//             });
//             // Save the new stall to the database
//             await newStall.save();
//           }
//           process.exit(0);
//         } catch (error) {
//           console.log("asdfesw", error.message);
//         }

//         // Return success response
//       })
//       .catch((error) => {
//         // Handle MongoDB connection failure
//         console.error("Faileed to connect to MongoDB:", error);
//         process.exit(1); // Exit the process if DB connection fails
//       });
//     // Check if the 'name' is provided
//   } catch (error: any) {
//     // Handle errors and send a response
//     console.log("i am error");
//   }
// };
// createStall();

