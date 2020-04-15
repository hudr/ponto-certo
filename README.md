# Projeto da Universidade - São Judas Tadeu

## Tecnologias/Frameworks utilizadas
- React
- Firebase
- Sheetson
- Material UI

## Objetivo
- Criar um projeto capaz de automatizar as marcações de ponto das empresas usando geolocalização para determinar se o profissional está ou não no local de trabalho. Se positivo o usuário consegue realizar as seguintes marcações: entrada, almoço, retorno e saída.

## Restrições
- O profissional só pode realizar marcações se estiver num raio de 150m do local (tolerância);
- Marcações de retorno só podem ser feitas após 30 minutos da marcação do almoço (determinação por lei [clt]);
- Se o profissional não terminar as marcações do dia anterior, no novo dia a primeira marcação será 'Entrada';
- O profissional não pode marcar mais do que 4x no mesmo dia, um alerta aparecerá dizendo que ele concluiu as marcações.

## Melhorias
Pelo tempo de implementação e entrega algumas melhorias podem ser feitas, sendo elas:
- Fazer um loader personalizado e não estático como está apresentado;
- Implementação de dashboard de cadastro para uma equipe de RH;
- Recuperação de senha pelo Firebase;
- Implementar novos métodos de login;

## É isso! Sinta-se a vontade para tirar dúvidas sobre o projeto.
