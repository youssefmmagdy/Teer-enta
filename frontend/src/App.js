import "./index.css";
import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Signup from "./components/Auth/Signup/Signup.js";
import Login from "./components/Auth/Login/login.js";
import Profile from "./components/Profile/profile.js";
import ActivityList from "./components/Activity/ActivityList.tsx"; // From feat/activities
import TouristWelcome from "./components/WelcomePage/TouristWelcome.jsx";
import ReadHistoriaclPlaces from "./components/HistoricalPlaces/readHistoriaclPlaces.jsx";
import CreateHistoricalPlaces from "./components/HistoricalPlaces/createHistoricalPlaces.jsx";
import UpdateHistoricalPlaces from "./components/HistoricalPlaces/updateHistoriaclPlaces.jsx";
import ShowHistoricalPlaces from "./components/HistoricalPlaces/showHistoricalPlaces.jsx";
import AllUsers from "./components/Users/viewUsers/viewAllUsers";
import PendingUsers from "./components/Users/pendingUsers/pendingUsers";
import AddUser from "./components/Users/addUser/addUser";

import ProductDetails from "./components/Store/productDetails";
import AdminProductForm from "./components/Store/adminProductForm";
import AdminProductGrid from "./components/Store/adminProductGrid";
import EditProductForm from "./components/Store/editProductForm";
import QuantityAndSales from "./components/Store/quantityAndSales.jsx"
import IternaryScreen from "./components/Itinerary/ItineraryScreen.jsx";
import PreferenceTags from "./components/Tags/PrefrenceTags.tsx";
import ActivityCategories from "./components/Activity/ActivityCategories.tsx";
import Tags from "./components/Tags/Tags.tsx";
import DrawerBar from "./components/shared/SideBar/Drawer.js";
import TouristNavBar from "./components/shared/NavBar/TouristNavBar.jsx";
import AllActivitiesCRUD from "./components/Activity/AllActivitiesCRUD.tsx";
import ConfirmationModal from "./components/shared/ConfirmationModal.js";
import IternaryDetails from "./components/Itinerary/IternaryDetails.tsx";
import ActivityDetails from "./components/Activity/ActivityDetails.tsx";
import TouristActivity from "./components/Activity/TouristActivity/TouristActivity.js";
import ChangePassword from "./components/Profile/ChangePassword.js";
import DeleteAccountButton from "./components/Profile/DeleteAccountButton.js";
import FlaggedIternary from "./components/Itinerary/FlaggedIternary.jsx";
import FlaggedActivities from "./components/Activity/FlaggedActivities.jsx";
import ComplaintsManagement from "./components/Users/complain/complaintsManagement.js";
import MyComplaints from "./components/Users/complain/myComplaints.js";
import ShowDocuments from "./components/Users/pendingUsers/ShowDocuments.js";
import BookHotel from "./components/Hotel/BookHotel.jsx";
import CreateTransportation from "./components/Transportation/CreateTransportation.jsx";
import BookTransportation from "./components/Transportation/BookTransportation.jsx";
import BookFlight from "./components/Flight/BookFlight.jsx";
import NewProfile from "./components/Profile/NewProfile.js";

function App() {
  const [flag, setFlag] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [isNavigate, setIsNavigate] = useState(false);

  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };

  const onLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("isAuthenticated");
    setIsNavigate(true);
    setModalOpen(false);
  };

  return (
      <div className="App relative">
        <Router>
          {!flag && (
              <DrawerBar
                  onClose={onClose}
                  showDrawer={showDrawer}
                  drawerVisible={visible}
              />
          )}
          {!flag && (
              <div className="relative bg-[#075B4C] z-10 size-full flex flex-col items-center">
                <TouristNavBar
                    setModalOpen={setModalOpen}
                    isNavigate={isNavigate}
                    setIsNavigate={setIsNavigate}
                />
              </div>
          )}

          <ConfirmationModal
              isOpen={isModalOpen}
              onClose={() => setModalOpen(false)}
              onConfirm={onLogout}
              message={`Are you sure you want to log out?`}
          />

          <Routes>
            {/* General Routes */}
            <Route path="/" element={<TouristWelcome setFlag={setFlag} />} />
            <Route path="/signup" element={<Signup setFlag={setFlag} />} />
            <Route path="/login" element={<Login setFlag={setFlag} flag={flag} />} />
            <Route path="/profile" element={<Profile setFlag={setFlag} />} />
            <Route path="/preference-tags" element={<PreferenceTags setFlag={setFlag} />} />

            {/* Activity Routes */}
            <Route path="/activities" element={<AllActivitiesCRUD setFlag={setFlag} />} />
            <Route path="/flaggedActivities" element={<FlaggedActivities setFlag={setFlag} />} />
            <Route path="/activities/my" element={<AllActivitiesCRUD setFlag={setFlag} />} />
            <Route path="/activity-categories" element={<ActivityCategories setFlag={setFlag} />} />
            <Route path="/tags" element={<Tags setFlag={setFlag} />} />
            <Route path="/activity" element={<ActivityList setFlag={setFlag} />} />

            {/* Historical Places Routes */}
            <Route path="/historicalPlace" element={<ReadHistoriaclPlaces setFlag={setFlag} />} />
            <Route path="/historicalPlace/my" element={<ReadHistoriaclPlaces setFlag={setFlag} />} />
            <Route path="/historicalPlace/create" element={<CreateHistoricalPlaces setFlag={setFlag} />} />
            <Route path="/historicalPlace/update/:id" element={<UpdateHistoricalPlaces setFlag={setFlag} />} />
            <Route path="/historicalPlace/details/:id" element={<ShowHistoricalPlaces setFlag={setFlag} />} />

            {/* User Management Routes */}
            <Route path="/allUsers" element={<AllUsers setFlag={setFlag} />} />
            <Route path="/pendingUsers" element={<PendingUsers setFlag={setFlag} />} />
            <Route path="/showDocuments/:id" element={<ShowDocuments />} />
            <Route path="/addUser" element={<AddUser setFlag={setFlag} />} />

            {/* Product Management Routes */}
            <Route path="/products" element={<AdminProductGrid setFlag={setFlag} />} />
            <Route path="/products/:id" element={<ProductDetails setFlag={setFlag} />} />
            <Route path="/products/create" element={<AdminProductForm setFlag={setFlag} />} />
            <Route path="/products/edit/:productId" element={<EditProductForm setFlag={setFlag} />} />
              <Route path="/products/quantity&sales" element={<QuantityAndSales setFlag={setFlag} />}/>
            {/* Itinerary Routes */}
            <Route path="/itinerary/*" element={
              <Routes>
                <Route path="activityDetails/:id" element={<ActivityDetails setFlag={setFlag} />} />
                <Route path="/" element={<IternaryScreen setFlag={setFlag} />} />
                <Route path="flaggedIternaries" element={<FlaggedIternary setFlag={setFlag} />} />
                <Route path="iternaryDetails/:id" element={<IternaryDetails setFlag={setFlag} />} />
              </Routes>
            }/>

            {/* Hotel Routes */}
            <Route path="/hotel/*" element={
              <Routes>
                <Route path="book" element={<BookHotel setFlag={setFlag} />} />
              </Routes>
            }/>

            {/* Transportation Routes */}
            <Route path="/transportation/*" element={
              <Routes>
                <Route path="create" element={<CreateTransportation setFlag={setFlag} />} />
                <Route path="book" element={<BookTransportation setFlag={setFlag} />} />
              </Routes>
            }/>

            {/* Flight Routes */}
            <Route path="/flight/*" element={
              <Routes>
                <Route path="bookFlight" element={<BookFlight setFlag={setFlag} />} />
              </Routes>
            }
          />

          <Route
            path="/itinerary/my"
            element={<IternaryScreen setFlag={setFlag} />}
          />
          <Route
            path="/touristActivities"
            element={<TouristActivity setFlag={setFlag} />}
          />
          <Route
            path="/changePassword"
            element={<ChangePassword setFlag={setFlag} />}
          />
          <Route
            path="/requestAccountDeletion"
            element={<DeleteAccountButton setFlag={setFlag} />}
          />
          <Route
            path="/ComplaintsManagement"
            element={<ComplaintsManagement />}
          />
          <Route
            path="/newProfile"
            element={<NewProfile />}
          />
          <Route path="/myComplaints" element={<MyComplaints />} />
        </Routes>
        <Toaster />
      </Router>
    </div>
  );
}

export default App;
