def is_owner(request, id):
    """ Checks if request user is server owner.
    returns True or False """
    user = request.user
    id_list = [server.id for server in user.server_set.filter(creator=user)]
    return id in id_list

def server_has_user(request, id):
    """ Checks if request user is in requested server.
    returns True or False """
    try:
        request.user.server_set.get(id=id)
        return True
    except:
        return False