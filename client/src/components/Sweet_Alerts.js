import swal from 'sweetalert';

// Delete Alert
export const DeleteAlert = (deleteRow, url, token, id, email) => {
    return new Promise((resolve) => {
        swal({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover data!",
            icon: "warning",
            buttons: true,
            dangerMode: true,

        })
            .then((willDelete) => {
                if (willDelete) {
                    swal("Poof! Your this data has been deleted!", {
                        icon: "success",
                    });
                    deleteRow(url, token, id, email);
                    resolve(true);
                } else {
                    resolve(false);
                }
            });
    });
};


