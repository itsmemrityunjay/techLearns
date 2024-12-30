import React, { useState, useEffect } from "react";
import { db } from "../../database/Firebase";
import { useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import {
  Search,
  FilterList,
  List,
  StarBorder,
  Flag,
  Science,
  People,
  Celebration,
  SmartToy,
  BarChart,
  BorderColor,
} from "@mui/icons-material";
import gradiantimg from "../../components/comp/gradiant.jpg";
import UpgradeButton from "../../components/comp/compComponent";
import CourseBanner from "./divider";
const filters = [
  {
    title: "All Competitions",
    description: "Everything, past & present",
    icon: <List />,
  },
  {
    title: "Featured",
    description: "Premier challenges with prizes",
    icon: <StarBorder />,
  },
  {
    title: "Getting Started",
    description: "Approachable ML fundamentals",
    icon: <Flag />,
  },
  {
    title: "Research",
    description: "Scientific and scholarly challenges",
    icon: <Science />,
  },
  {
    title: "Community",
    description: "Created by fellow Kagglers",
    icon: <People />,
  },
  {
    title: "Playground",
    description: "Fun practice problems",
    icon: <Celebration />,
  },
  {
    title: "Simulations",
    description: "Train bots to navigate environments",
    icon: <SmartToy />,
  },
  {
    title: "Analytics",
    description: "Open-ended explorations",
    icon: <BarChart />,
  },
];

const Searchbar = () => {
  const [competitions, setCompetitions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("All Competitions");

  // Fetch competitions from Firestore
  useEffect(() => {
    const fetchCompetitions = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "competitions"));
        const competitionsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCompetitions(competitionsData);
      } catch (error) {
        console.error("Error fetching competitions:", error);
      }
    };
    fetchCompetitions();
  }, []);

  const navigate = useNavigate();
  // Filter and Search Logic
  const filteredCompetitions = competitions.filter((comp) => {
    const matchesSearch =
      comp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comp.subtitle.toLowerCase().includes(searchTerm.toLowerCase());

    switch (activeFilter) {
      case "All Competitions":
        return matchesSearch;
      case "Featured":
        return matchesSearch && comp.isFeatured;
      case "Getting Started":
        return matchesSearch && comp.type === "ml-fundamentals";
      default:
        return false;
    }
  });

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col items-center bg-white-100">

        {/* Search Bar */}
        <div className="w-full max-w-8xl bg-white rounded-lg p-4 mb-6 shadow-sm">
          <div className="flex items-center mb-4">
            <span className="text-[--secondary-color] mr-2">
              <Search />
            </span>
            <input
              type="text"
              placeholder="Search competitions"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 border border-[--secondary-color] rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="flex items-center ml-2 border border-gray-300 rounded-md px-4 py-2 hover:bg-gray-100">
              <FilterList />
              <span className="ml-1">Filters</span>
            </button>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="w-full max-w-8xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-white py-6 rounded-lg shadow-sm">
          {filters.map((filter, index) => (
            <button
              key={index}
              className={`flex flex-col items-start p-4 border border-gray-300 rounded-md hover:bg-gray-100 shadow-sm relative transition-transform transform hover:scale-105 ${activeFilter === filter.title ? 'bg-gray-200 font-bold' : ''}`}
              onClick={() => setActiveFilter(filter.title)}
            >
              <div className="absolute top-2 right-2 text-[--secondary-color]">
                {filter.icon}
              </div>
              <span className="text-gray-800 font-semibold">{filter.title}</span>
              <p className="text-gray-500">{filter.description}</p>
            </button>
          ))}
        </div>

        {/* Display Filtered Competitions */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCompetitions.map((comp, index) => (
            <div key={index}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => navigate(`/competition/${comp.id}`)}>
              {/* <img
                                src={comp.icon || "https://newsroom.unl.edu/announce/files/file169147.jpg"} // Replace with a default icon URL
                                alt={comp.title}
                                className="w-full h-40 object-cover rounded-t-lg"
                            />
                            <div className="p-4">
                                <h4 className="text-md font-semibold mb-2">{comp.title}</h4>
                                <p className="text-sm text-gray-600 mb-4">{comp.description}</p>
                                <div className="flex justify-between items-center text-sm text-gray-500 mb-2">
                                    <span>{comp.teams}</span>
                                    <span>{comp.status}</span>
                                </div>
                                <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                                    <span className="text-sm font-medium text-gray-700">{comp.tag}</span>
                                    <span className="text-sm text-green-500">{comp.status}</span>
                                </div>
                            </div> */}

              <div key={index} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
                {/* Image with curved corners */}
                <img src={comp.icon} alt={comp.title} className="w-full h-40 object-cover rounded-t-lg" />
                <div className="p-4">
                  <h4 className="text-md font-semibold mb-2">{comp.title}</h4>
                  <p className="text-sm text-gray-600 mb-4">{comp.description}</p>
                  <div className="flex justify-between items-center text-sm text-gray-500 mb-2">
                    <span>{comp.privacy}</span>
                    <span>{comp.status}</span>
                  </div>
                  {/* Tag and status at the bottom */}
                  <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                    <span className="text-sm font-medium text-gray-700">{comp.prizePool}</span>
                    <span className="text-sm text-green-500">{comp.status}</span>
                  </div>
                </div>
              </div>

              {/* Display Filtered Competitions */}
              <div className="w-full h-[500px] mt-5">
                <div className="w-[90%] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {filteredCompetitions.map((comp, index) => (
                    <div
                      key={index}
                      className="p-6 rounded-lg shadow-md cursor-pointer flex flex-col justify-between mt-5"
                      // style={{ backgroundColor: comp.bgColor || "#f8f9fa" }} // Default background color
                      onClick={() => navigate(`/competition/${comp.id}`)}
                      style={{
                        backgroundImage: `url(${gradiantimg})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    >
                      {/* Image in a small circle */}
                      <div className="flex items-center mb-4">
                        <img
                          src={comp.icon || "https://via.placeholder.com/50"} // Default placeholder
                          alt={comp.title}
                          className="w-10 h-10 rounded-full border border-gray-200"
                        />
                        <p className="ml-3 text-sm uppercase opacity-80">
                          {comp.category || "Strategy"}
                        </p>
                      </div>

                      {/* Title and description */}
                      <h3 className="text-lg font-semibold mt-2 line-clamp-1">
                        {comp.title}
                      </h3>
                      <p className="text-sm mt-1">{comp.description}</p>

                      {/* Footer with duration and returns */}
                      <div className="mt-4">
                        <p className="text-sm opacity-70">
                          {comp.duration || "3 yrs CAGR"}
                        </p>
                        <h2 className="text-xl font-bold">
                          {comp.returns || "7.20%"}
                        </h2>
                      </div>
                    </div>
        </div>
                );
};

                export default Searchbar;
