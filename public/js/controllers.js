
function ContactController($scope, $http) {
    var local_address = 'http://localhost:3000/';
    var deletingContact;
    $http.get(local_address + 'contacts/get').success(function(data) {
        $scope.contacts = data;

    });

    // subscribe to AddContact event
    $scope.$on('AddContact', function() {
        $scope.addContact($scope.newcontact);
    });

    // send request to server to add new contact
    $scope.addContact = function(contact) {
        if (contact) {
            $http.post(local_address + 'contacts/add', $.param({
                contact: contact
            }), {
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            })
            .success(function(data) {
                toastr.success("New contact has been added", "Yay!");
                $scope.contacts.push(data);
                angular.element("#newContactModal").modal('hide');
                return true;
            })
            .error(function() {
                toastr.error("Oops, something wrong happened, please try again");
            });
        }
        return false;
    };

    $scope.onContactChange = function(contact) {
        if (contact) {
            $http.put(local_address + 'contacts/update', $.param({
                contact: contact
            }), {
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            })
            .success(function(data) {
                toastr.success("Contact's data has been updated", "Yay!");
                return true;
            })
            .error(function() {
                toastr.error("Oops, something wrong happened, please try again");
            });
        }
    }

    $scope.$on('DeleteContact', function() {
        $scope.removeContact($scope.deletingContact);
    });

    $scope.removeContact = function(contact) {
        $http.delete(local_address + 'contacts/delete', {
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            data: $.param({
                contact: contact
            })
        })
        .success(function(data) {
            toastr.success("Contact's data has been deleted", contact.name + " says Bye!");
            angular.element("#deleteAlertModal").modal('hide');
            var updated = $scope.contacts.filter(function(c) {
               return contact!==c;
            });
            $scope.contacts = updated;
            return true;
        })
        .error(function() {
            toastr.error("Oops, something wrong happened, please try again");
        });
    }

    $scope.onContactDelete = function(contact) {
        $scope.deletingContact = contact;
        angular.element("#deleteAlertModal").modal('show');
    }

}