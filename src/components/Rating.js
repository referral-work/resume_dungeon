import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core';
import Star from './Star';

const useStyles = makeStyles((theme) => ({
    ratingContainer: {
        textAlign: 'right',
        padding: 10,
        paddingRight: 20
    },
    ratingTitle: {
        fontSize: 12
    },
    ratingStars: {
        fontSize: 26
    }
}))

const Rating = ({ recordedFeedback, setRecordedFeedback}) => {
    const classes = useStyles()
    const handleStarClick = (selectedRating) => {
        setRecordedFeedback(selectedRating)
    };

    return (
        <div className={classes.ratingContainer}>
            <div className={classes.ratingTitle}>How helpful was this?</div>
            <div className={classes.ratingStars}>
                {[1, 2, 3, 4, 5].map((num) => (
                    <Star
                        key={num}
                        selected={num <= recordedFeedback}
                        onSelect={() => handleStarClick(num)}
                    />
                ))}
            </div>
        </div>
    );
};

export default Rating;
