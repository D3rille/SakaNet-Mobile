// import React, { useState } from "react";
// import {
//   Button,
//   Card,
//   CardContent,
//   FormControl,
//   IconButton,
//   InputAdornment,
//   TextField,
//   Typography,
// } from "@mui/material";
// import { Visibility, VisibilityOff } from "@mui/icons-material";
// import { FORGOT_PASSWORD_MUTATION } from "../../graphql/operations/email";
// import toast, { Toaster } from "react-hot-toast";
// import { useMutation } from "@apollo/client";
// import { useRouter } from "next/router";


// export default function Reset({variables}) {
//   const [pass, setPass] = useState("");
//   const [confirmPass, setConfirmPass] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const router = useRouter();

//   const [forgotPassword, { loading, data, error }] = useMutation(
//     FORGOT_PASSWORD_MUTATION
//   );

//   const changePassword = async () => {
//     console.log(variables.email)
//     try {
//       const result = await forgotPassword({
//         variables: { email: variables.email, newPassword: pass },
//       });

//       toast.success('Password changed successfully');
//       router.push("/");

//     } catch (error) {
//       toast.error(error.message);
//     }
//   };

//   const handleTogglePassword = () => {
//     setShowPassword((prev) => !prev);
//   };

//   const handleToggleConfirmPassword = () => {
//     setShowConfirmPassword((prev) => !prev);
//   };

//   return (
//     <div
//       style={{
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         height: "100vh",
//       }}
//     >
//       <Toaster />
//       <Card style={{ maxWidth: 400, width: "100%" }}>
//         <CardContent>
//           <Typography variant="h4" align="center" fontWeight="bold" mb={1}>
//             Change Password
//           </Typography>
//           <form>
//             <FormControl fullWidth variant="outlined" margin="normal">
//               <TextField
//                 label="New Password"
//                 type={showPassword ? "text" : "password"}
//                 fullWidth
//                 variant="outlined"
//                 value={pass}
//                 onChange={(e) => setPass(e.target.value)}
//                 required
//                 InputProps={{
//                   endAdornment: (
//                     <InputAdornment position="end">
//                       <IconButton onClick={handleTogglePassword} edge="end">
//                         {showPassword ? <Visibility /> : <VisibilityOff />}
//                       </IconButton>
//                     </InputAdornment>
//                   ),
//                 }}
//               />
//             </FormControl>
//             <FormControl fullWidth variant="outlined" margin="normal">
//               <TextField
//                 label="Confirm Password"
//                 type={showConfirmPassword ? "text" : "password"}
//                 fullWidth
//                 variant="outlined"
//                 value={confirmPass}
//                 onChange={(e) => setConfirmPass(e.target.value)}
//                 required
//                 InputProps={{
//                   endAdornment: (
//                     <InputAdornment position="end">
//                       <IconButton onClick={handleToggleConfirmPassword} edge="end">
//                         {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
//                       </IconButton>
//                     </InputAdornment>
//                   ),
//                 }}
//               />
//             </FormControl>
//             <Button
//               variant="contained"
//               color="primary"
//               fullWidth
//               onClick={changePassword}
//               style={{ backgroundColor: "#2f613a", color: "#ffffff", marginTop: 16 }}
//             >
//               Reset Password
//             </Button>
//           </form>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }
