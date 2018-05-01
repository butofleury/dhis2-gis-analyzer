import { createMuiTheme } from 'material-ui/styles';
import {
    blue300,blue500, blue700, blue900,
    pinkA200, grey100, grey200,
    grey300, grey500, white,
    darkBlack, fullBlack } from 'material-ui/colors';

const theme = createMuiTheme({
    palette: {
        primary1Color: blue700,
        primary2Color: blue900,
        primary3Color: grey200,
        accent1Color: blue700,
        accent2Color: grey100,
        accent3Color: grey500,
        textColor: darkBlack,
        alternateTextColor: white,
        canvasColor: white,
        borderColor: grey300,
        disabledColor: darkBlack,
        pickerHeaderColor: blue500,
        clockCircleColor: darkBlack,
        shadowColor: fullBlack,
    },
});

export default theme;
