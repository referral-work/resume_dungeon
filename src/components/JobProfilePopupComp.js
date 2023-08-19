import React, { useState } from "react";
import Modal from "react-modal";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  customModal: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  },
  modalContent: {
    width: "300px",
    height: '350px',
    marginLeft: 'auto',
    marginRight: 'auto',
    backgroundColor: 'white',
    borderRadius: 10,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: 20
  },
  searchInput: {
    borderRadius: 5,
    outline: "none",
    padding: 10,
    border: '2px solid darkgrey transparent',
    transition: "border-width 0.1s ease",
    "&:focus": {
      border: "2px solid darkgrey"
    }
  },
  closeButton: {
    width: '100%',
    marginLeft: 'auto',
    marginRight: 'auto',
    padding: '10px',
    display: 'block',
    cursor: 'pointer',
    backgroundColor: '#c42222',
    color: 'white',
    fontSize: 16,
    fontWeight: 500,
    border: 'none',
    borderRadius: 5,
    "&:hover": {
        backgroundColor: '#ee2b2b'
    }
  },
  searchResult: {
    height: 240
  },
  selectableItem: {
    border: 'none',
    display: 'block',
    cursor: 'pointer',
    padding: 10,
    width: '100%',
    textAlign: 'left',
    borderBottom: '1px solid lightgrey',
    backgroundColor: ''
  }
}));

const JobProfilePopup = ({ isOpen, onClose, jobProfiles, selectedProfile, setSelectedProfile }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const filteredProfiles = jobProfiles.filter(profile =>
    profile.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const classes = useStyles();

  const setSelectedProfileAndClose = (profile) => {
    setSelectedProfile(profile)
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      appElement={document.getElementById("root")}
      className={classes.customModal}
    >
      <div className={classes.modalContent}>
        <input
          type="text"
          placeholder="Search job profiles"
          value={searchQuery}
          className={classes.searchInput}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className={classes.searchResult}>
            {filteredProfiles.map((profile) => (
                <button
                    key={profile}
                    className={`${classes.selectableItem} ${
                        selectedProfile === profile ? classes.selected : ""
                    }`}
                    onClick={() => setSelectedProfileAndClose(profile)}
                    >
                    {profile}
                </button>
            ))}
        </div>
        <div>
            <button className={classes.closeButton} onClick={onClose}>Close</button>
        </div>
      </div>
    </Modal>
  );
};

export default JobProfilePopup