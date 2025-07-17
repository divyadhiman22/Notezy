import { Route, Routes } from "react-router-dom";
import About from "./About";
import Login from "./Login";
import Navbar from "../components/Navbar";
import Contact from "./Contact";
import Error from "./Error";
import Logout from "./Logout";
import VerifyOTP from "./VerifyOtp";
import AddNotes from "./AddNotes";
import ViewNotes from "./ViewNotes";
import PrivateRoute from "./PrivateRoutes";  
import NoteUpdate from "./NoteUpdate";
import Profile from "./Profile";
import Home from "./Home";
import ForgotPassword from "./ForgotPassword";
import ResetPassword from "./ResetPassword";
import Signup from "./Signup";
import Services from "./Services";
import NotesLayout from "../components/NotesLayout";

const Routess = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/forgot-password" element={<ForgotPassword/>} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="*" element={<Error />} />


        <Route
          path="/notes"
          element={
            <PrivateRoute>
              <NotesLayout/>
            </PrivateRoute>
          }
        >
          <Route path="add" element={<AddNotes />} />
          <Route path="view" element={<ViewNotes />} />
          <Route path="note/:id/edit" element={<NoteUpdate />} />
        </Route>
      </Routes>
    </>
  );
};

export default Routess;
