def desk_has_user(request, id):
    try:
        request.user.desk_set.get(id=id)
        return True
    except:
        return False