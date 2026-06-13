/**
 * @author a.demeshko
 * created on 28.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.components.mail')
    .controller('MailDetailCtrl', MailDetailCtrl);

  /** @ngInject */
  function MailDetailCtrl($stateParams, $state, mailMessages) {
    var vm = this;
    vm.label = $stateParams.label;
    vm.mail = mailMessages.getMessageById($stateParams.id, vm.label);
    if (!vm.mail) {
      $state.go('components.mail.label', { label: vm.label });
    }
  }

})();
