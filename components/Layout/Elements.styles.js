import { Button, Input, InputNumber, Select, Upload } from 'antd'
import styled from 'styled-components'
export const LoginContainer = styled.div`
  display: flex;
`

export const LoginCard = styled.div`
  /* margin: auto;
  align-self: center; */
  width: 400px;
  margin: auto;
  min-height: 700px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  justify-content: center;
  padding: 20px 0;
  align-items: center;
  background-color: white;
  border-radius: 10px;
  line-height: 1.2 rem;
  @media (max-width: 600px) {
    width: 100%;
    min-height: 100vh;
    justify-content: flex-start;
    border-radius: 0;
  }
  h1 {
    margin: 30px 0;
    font-size: 32px;
    font-weight: 700;
    padding: 0;
    /* text-align: center; */
  }
  form {
    width: 80%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 15px 5px;
    button {
      margin: 20px auto;
    }
  }
`

export const SocialLoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
`
export const SocialCard = styled.div`
  height: 40px;
  width: 40px;
  border-radius: 50%;
  background-color: transparent;
  /* box-shadow: 0px 2px 10px gray; */
  &:hover {
    cursor: pointer;
    box-shadow: 0px 3px 20px gray;
    transition: box-shadow 0.2s ease-out;
  }
`

export const ResetContainer = styled.div`
  border: 1px dotted gray;
  margin: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  width: 300px;
  min-height: 300px;
  background-color: white;
  padding: 20px 10px;
  border-radius: 15px;
  h3 {
    text-align: center;
  }
  form {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
`

export const InputText = styled(Input)`
  width: 100%;
  font-size: ${(props) => (props.large ? '18px' : '14px')};
  border: none;
  border-radius: 10px;
  outline: none;
  padding: 10px;
  border-color: none;
  border-bottom: 4px solid #fbbc05;
  box-shadow: 0px 10px 30px gray;
`

export const InputPassword = styled(Input.Password)`
  width: 100%;
  font-size: 18px;
  border: none;
  border-radius: 10px;
  outline: none;
  padding: 10px;
  border-color: none;
  border-bottom: 4px solid #fbbc05;
  box-shadow: 0px 10px 30px gray;
`
export const NumberInput = styled(InputNumber)`
  width: 100%;
  font-size: 14px;
  border: none;
  border-radius: 10px;
  outline: none;
  padding: 0px;
  border-color: none;
  border-bottom: 4px solid #fbbc05;
  box-shadow: 0px 10px 30px gray;
`
export const FileUpload = styled(Upload)`
  width: 100%;
  font-size: 18px;
  border: none;
  border-radius: 10px;
  border-bottom: 4px solid #fbbc05;
  box-shadow: 0px 10px 30px gray;
`
export const SelectOption = styled(Select)`
  width: 100%;
  * {
    border-radius: 10px;
  }
  font-size: 14px;
  /* padding: 10px ; */
  border-radius: 10px;
  border-color: none;
  border: none;
  outline: none !important;
  border-bottom: 4px solid #fbbc05;
  box-shadow: 0px 10px 30px gray;
`

export const ButtonSubmit = styled(Button)`
  margin: 0 auto;
  background-color: white;
  color: gray;
  padding: 5px 10px;
  border-radius: 5px;
`
