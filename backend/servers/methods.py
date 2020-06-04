def is_owner(request, id):
    user = request.user
    id_list = [server.id for server in user.server_set.filter(creator=user)]
    return id in id_list

def server_has_user(request, id):
    try:
        request.user.server_set.get(id=id)
        return True
    except:
        return False