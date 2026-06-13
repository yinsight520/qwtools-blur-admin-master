/**
 * @author a.demeshko
 * created on 28.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.components.mail')
    .controller('MailDetailCtrl', MailDetailCtrl);

  /** @ngInject */
  function MailDetailCtrl($stateParams, mailMessages) {
    var vm = this;
    var mail = mailMessages.getMessageById($stateParams.id);
    if (mail && mail.labels.indexOf($stateParams.label) !== -1) {
      vm.mail = mail;
    } else {
      vm.mail = null;
    }
    vm.label = $stateParams.label;
  }

})();
