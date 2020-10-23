import React from 'react';
import { useModal } from '../context/modalContext/ModalContext';
import { ModalHookProvider } from '../context/modalContext/ModalContext';
import { Modal } from '../Me/Modals/Modal';

export default { title: 'Modals' };

const Comp = () => {
  const [openModal] = useModal(<Modal />);
  return <button onClick={openModal}>Open Modal</button>;
};

export const Me = () => (
  <ModalHookProvider>
    <Comp />
  </ModalHookProvider>
);

const WithTitle = () => {
  const [openModal] = useModal(<Modal title="Example Title" />);
  return <button onClick={openModal}>Open Modal</button>;
};

export const MeModalWithTitle = () => (
  <ModalHookProvider>
    <WithTitle />
  </ModalHookProvider>
);

const WithContent = () => {
  const [openModal] = useModal(
    <Modal title="Example Title">
      <h2> Cupcake Ipsum </h2>
      <div>
        <p>
          Chocolate danish jujubes gingerbread. Marshmallow wafer oat cake apple
          pie cake dragée. Ice cream sweet sweet roll brownie. Chocolate carrot
          cake candy danish. Brownie oat cake gummies carrot cake lemon drops.
          Brownie jelly beans chocolate cake bear claw fruitcake marzipan
          gummies ice cream gummi bears. Topping jujubes bear claw. Pudding
          danish wafer oat cake. Bonbon lollipop oat cake biscuit jelly beans
          cake bonbon candy candy canes. Macaroon chocolate oat cake dragée
          chocolate cake bear claw. Sweet roll soufflé jelly beans. Biscuit
          soufflé pastry halvah tart sweet roll.
        </p>
        <p>
          Toffee sugar plum donut gingerbread liquorice chocolate cake soufflé.
          Gingerbread jelly beans chocolate tiramisu dessert tiramisu gummi
          bears pudding lollipop. Candy sesame snaps fruitcake ice cream
          marshmallow jelly. Tiramisu chocolate bar cheesecake dessert icing
          croissant. Powder tiramisu sweet roll pastry. Sweet croissant pie
          lemon drops biscuit carrot cake powder brownie. Wafer soufflé carrot
          cake cheesecake dragée biscuit jujubes liquorice. Cupcake jujubes
          gummies pudding oat cake marshmallow fruitcake. Cheesecake cotton
          candy danish bonbon jelly gummies gummies gummies chupa chups. Tootsie
          roll sweet topping bonbon. Muffin gummi bears topping tiramisu.
          Tiramisu soufflé dragée cake gummi bears.
        </p>
        <p>
          Lemon drops oat cake candy canes powder bear claw jelly beans. Toffee
          lemon drops marzipan topping oat cake jelly sugar plum candy canes.
          Tart powder chocolate cake sugar plum. Cupcake cotton candy topping
          candy canes. Tart gummies sweet jujubes halvah chocolate bar gummi
          bears. Jujubes apple pie soufflé pastry donut bear claw tart bonbon.
          Oat cake sweet cake icing brownie dessert cupcake. Ice cream halvah
          cake. Tootsie roll lollipop brownie sweet roll pastry jelly-o chupa
          chups. Sugar plum sweet cookie sweet roll topping toffee pudding
          cookie. Apple pie caramels cupcake sweet toffee dragée. Croissant tart
          bonbon powder apple pie bonbon carrot cake sweet soufflé. Tiramisu
          cake croissant tootsie roll bear claw. Tiramisu jujubes toffee carrot
          cake.
        </p>
        <p>
          Danish jujubes cookie sesame snaps candy canes liquorice. Chupa chups
          donut cake cookie bonbon. Bear claw cotton candy sesame snaps wafer
          biscuit gingerbread. Soufflé dessert apple pie cupcake pudding wafer
          liquorice sweet apple pie. Tiramisu dragée bear claw dessert icing oat
          cake. Pie cake gummi bears jelly beans croissant muffin. Sweet muffin
          tart marshmallow chocolate bar biscuit dragée cheesecake ice cream.
          Tiramisu dessert chocolate soufflé cheesecake macaroon marzipan sweet
          roll carrot cake. Ice cream halvah chocolate cake. Oat cake pastry
          muffin soufflé cake. Caramels cookie jelly. Cake brownie gummi bears
          pastry cupcake.
        </p>
        <p>
          Chocolate bar ice cream marshmallow oat cake fruitcake sugar plum
          candy. Candy canes muffin croissant soufflé cupcake oat cake marzipan.
          Muffin cookie cupcake sugar plum chocolate cake. Icing chupa chups
          caramels lollipop biscuit jelly-o. Bonbon danish oat cake muffin
          danish macaroon icing. Dragée liquorice candy carrot cake cheesecake
          jelly beans. Cake marzipan candy canes pudding oat cake. Donut cookie
          cake cake oat cake. Brownie cupcake danish cotton candy jelly beans
          chocolate bar jelly-o. Lollipop candy canes pudding brownie. Tootsie
          roll macaroon bear claw toffee powder. Sweet jelly beans chocolate bar
          jelly. Toffee icing ice cream.
        </p>
      </div>
    </Modal>
  );
  return <button onClick={openModal}>Open Modal</button>;
};

export const MeModalWithContent = () => (
  <ModalHookProvider>
    <WithContent />
  </ModalHookProvider>
);
