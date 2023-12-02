import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import styled from 'styled-components';

const StyledFormControlLabel = styled(FormControlLabel)`
  span {
    font-family: 'Neo둥근모';
  }
`;

export const RadioButtonsGroup = () => {
  return (
    <FormControl>
      <FormLabel
        id="demo-radio-buttons-group-label"
        style={{ fontFamily: 'Neo둥근모' }}
      >
        성별
      </FormLabel>
      <RadioGroup
        aria-labelledby="demo-radio-buttons-group-label"
        defaultValue="female"
        name="radio-buttons-group"
      >
        <StyledFormControlLabel
          value="female"
          control={<Radio />}
          label="여성"
        />
        <StyledFormControlLabel value="male" control={<Radio />} label="남성" />
      </RadioGroup>
    </FormControl>
  );
};
