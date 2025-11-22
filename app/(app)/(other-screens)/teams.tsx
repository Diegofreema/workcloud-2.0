import React from 'react';
import { FetchTeamMembers } from '~/components/fetch-team';
import { HeaderNav } from '~/components/HeaderNav';
import { Container } from '~/components/Ui/Container';

const Teams = () => {
  return (
    <Container>
      <HeaderNav title="Team" />
      <FetchTeamMembers />
    </Container>
  );
};

export default Teams;
