import React, {Component} from 'react';
import {
  Container,
  Header,
  Content,
  Footer,
  FooterTab,
  Button,
  Icon,
  Text,
  Badge,
} from 'native-base';
export default class FooterTabsBadgeExample extends Component {
  render() {
    return (
      <Container>
        <Content />
        <Footer>
          <FooterTab>
            <Button badge vertical>
              <Badge>
                <Text>2</Text>
              </Badge>

              <Text>Apps</Text>
            </Button>
            <Button vertical>
              <Text>Camera</Text>
            </Button>
            <Button active badge vertical>
              <Badge>
                <Text>51</Text>
              </Badge>

              <Text>Navigate</Text>
            </Button>
            <Button vertical>
              <Text>Contact</Text>
            </Button>
          </FooterTab>
        </Footer>
      </Container>
    );
  }
}
