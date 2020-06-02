def is_owner(request):
    user = request.user
    id_list = [server.id for server in user.server_set.filter(creator=user)]
    id = int(request.GET.get('chat_id'))
    return id in id_list

def server_has_user(request, id):
    try:
        request.user.server_set.get(id=id)
        return True
    except:
        return False