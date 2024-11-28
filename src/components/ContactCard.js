import React from "react";
import styled from "styled-components";
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaFacebook, FaTwitter, FaYoutube, FaLinkedin, FaRss, FaInstagram, FaPinterest } from "react-icons/fa";

const CardContainer = styled.div`
  padding: 30px;
  width: 65vw;
  background-color: white;
  color: #333;
  border-radius: 6px;
  box-shadow: 0 8px 8px rgba(0, 0, 0, 0.1);
  margin-left: 40px;
  margin-top: 20px;
  margin-bottom: 40px;
  line-height: 1.6;
`;

const Title = styled.h2`
  font-size: 1.75rem;
  color: #131d52;
`;

const Divider = styled.hr`
  margin: 10px 0;
  border: 0.5px solid #ddd;
`;

const Info = styled.div`
  margin: 10px 0;
  display: flex;
  align-items: flex-start;
`;

const Icon = styled.div`
  color: #131d52;
  margin-right: 10px;
  margin-top: 4px;
`;

const Text = styled.div`
  font-size: 1rem;
  color: #666;
`;

const Label = styled.div`
  font-weight: bold;
  color: #333;
`;

const SocialIcons = styled.div`
  display: flex;
  justify-content: flex-start;
  margin-top: 10px;
`;

const SocialIcon = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  margin-right: 10px;
  color: white;
  border-radius: 4px;
  background-color: ${(props) => props.bgColor || "#333"};
  text-decoration: none;
  font-size: 18px;

  &:hover {
    opacity: 0.8;
  }
`;

function ContactCard() {
  return (
    <CardContainer>
      <Title>About Us</Title>
      <Divider />
      <Info>
        <Icon>
          <FaMapMarkerAlt />
        </Icon>
        <Text>
          <Label>Address:</Label> Ask Me Network, 33 Street, syada Zeinab, Cairo, Egypt.
        </Text>
      </Info>
      <Info>
        <Icon>
          <FaPhoneAlt />
        </Icon>
        <Text>
          <Label>Phone number:</Label> (+2)01111011110
        </Text>
      </Info>
      <Info>
        <Icon>
          <FaEnvelope />
        </Icon>
        <Text>
          <Label>E-mail:</Label> info@example.com
        </Text>
      </Info>
      <Info>
        <Label>Social links:</Label>
      </Info>
      <SocialIcons>
        <SocialIcon href="#" bgColor="#3b5998">
          <FaFacebook />
        </SocialIcon>
        <SocialIcon href="#" bgColor="#00acee">
          <FaTwitter />
        </SocialIcon>
        <SocialIcon href="#" bgColor="#FF0000">
          <FaYoutube />
        </SocialIcon>
        <SocialIcon href="#" bgColor="#0e76a8">
          <FaLinkedin />
        </SocialIcon>
        <SocialIcon href="#" bgColor="#FF4500">
          <FaRss />
        </SocialIcon>
        <SocialIcon href="#" bgColor="#e1306c">
          <FaInstagram />
        </SocialIcon>
        <SocialIcon href="#" bgColor="#bd081c">
          <FaPinterest />
        </SocialIcon>
      </SocialIcons>
    </CardContainer>
  );
}

export default ContactCard;
