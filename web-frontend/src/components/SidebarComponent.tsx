import { HiChartPie } from "react-icons/hi";
import { GiPublicSpeaker } from "react-icons/gi";
import { HiSpeakerphone } from "react-icons/hi";
import { MdOutlineOutput } from "react-icons/md";
import { FaUsers } from "react-icons/fa6";
import { FaMoon } from "react-icons/fa";
import { IoSettings } from "react-icons/io5";
import { SiHiveBlockchain } from "react-icons/si";
import { BiLogOutCircle } from "react-icons/bi";
import { Link } from "react-router-dom";
import { VscRepoPull } from "react-icons/vsc";
import { BsClipboardData } from "react-icons/bs";
import BlockchainIcon from '../assets/blockchain_icon.svg';
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Role } from "@/data_types";

function SideBarComponent() {
  const linkStyle = "flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700";
  const iconStyle = "w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white";
  const textTyle = "ml-3";
  
  const { authState, onLogOut, imageList } = useAuth();
  const navigate = useNavigate();
  const [url, setUrl] = useState();

  if (!authState || !authState.username) {
    return (
      <div>Loading ...</div>
    );
  }

  const onLogOutUser = () => {
    onLogOut!();
    navigate('/');
  }

  useEffect(() => {
    const userPhotoName = authState.name.toLowerCase().split(' ').join('.');
    if (imageList && imageList[userPhotoName]) {
      setUrl(imageList[userPhotoName] ?? 'default');
    }
  }, []);

  return (
    <aside className="flex flex-col left-0 top-0 w-60 h-screen fixed transition-transform sm:translate-x-0" aria-label="Sidebar">
      <div className="gap-5 flex flex-col h-screen px-3 py-2 rounded bg-white dark:bg-gray-800">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <span className="text-2xl font-bold text-gray-500 uppercase tracking-wider">ELECTION 2027</span>
        </div>

        <div>
          <Link to="dashboard" className={linkStyle}>
            <HiChartPie className={iconStyle} />
            <span className={textTyle}>Dashboard</span>
          </Link>
          <Link to="announce-election" className={linkStyle}>
            <HiSpeakerphone className={iconStyle} />
            <span className={textTyle}>Announce Election</span>
          </Link>
          <Link to="candidates" className={linkStyle}>
            <FaUsers className={iconStyle} />
            <span className={textTyle}>Candidates</span>
          </Link>
          <Link to="voters" className={linkStyle}>
            <BsClipboardData className={iconStyle} />
            <span className={textTyle}>Voters</span>
          </Link>
          <Link to="population-data" className={linkStyle}>
            <VscRepoPull className={iconStyle} />
            <span className={textTyle}>Population Data</span>
          </Link>
          <Link to="election-results" className={linkStyle}>
            <MdOutlineOutput className={iconStyle} />
            <span className={textTyle}>Election Results</span>
          </Link>
          <Link to="public-announcement" className={linkStyle}>
            <GiPublicSpeaker className={iconStyle} />
            <span className={textTyle}>Public Announcement</span>
          </Link>
          <Link to="blockchain" className={linkStyle}>
            <SiHiveBlockchain className={iconStyle} />
            <span className={textTyle}>Blockchain</span>
          </Link>

          { authState?.authenticated && authState?.role === Role.ADMIN &&
          <Link to="user" className={linkStyle}>
            <HiChartPie className={iconStyle} />
            <span className={textTyle}>User management</span>
          </Link>
          }

        </div>

        <div className=" items-center h-svh flex flex-row justify-between h-500 mr-4 align-center ">
          <div className="flex flex-row h-max items-center gap-2 h-500">
            <FaMoon className={iconStyle} />
            <span className="mt-1">Dark mode</span>
          </div>

          <div className="flex h-max flex-col items-center ">
            <label className="inline-flex items-center cursor-pointer">
              <input type="checkbox" value="" className="sr-only peer" disabled />
              <div className="relative w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600" />
            </label>
          </div>
        </div>

        <div className="flex flex-max flex-col items-center" >
          <img src={BlockchainIcon} width={150}></img>
        </div>

        <div className="flex h-screen flex-col justify-end">
          <div className="flex flex-col justify-end gap-2">
            <div className="flex flex-col gap-1">

              <span className="justify-start">
                Profile
              </span>

              <div className="flex items-center gap-2">
                <div>
                  <img height={50} width={50} src={url} className="rounded-full"></img>
                </div>

                <div className="flex flex-col bg-purple-0 gap-0">
                  <div className=" bg-slate-0"><span>{authState.name ?? "Unkown user"}</span></div>
                  <div className=" bg-blue-0"><span>{authState.role === Role.ADMIN ? "Admin account" : "Normal account"}</span></div>
                </div>
              </div>

            </div>

            <div className="flex items-center justify-between mr-4">
              <a className={linkStyle} onClick={onLogOutUser}>
                <BiLogOutCircle />Log out
              </a>

              <Link className={linkStyle} to="edit-account">
                <div className="flex flex-col items-center">
                  <IoSettings />
                  <span className="mt-1">Setting</span>
                </div>
              </Link>

            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default SideBarComponent
