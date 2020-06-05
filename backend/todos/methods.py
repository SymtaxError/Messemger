from .models import Desk
 
def is_owner(request, id):
    """ Checks if request user is desk owner.
    Returns True or False. """
    user = request.user
    id_list = [desk.id for desk in user.desk_set.filter(creator=user)]
    return id in id_list

def desk_has_user(request, desk_id):
    """ Checks if request user is in requested desk.
    Returns True or False. """
    try:
        desk = request.user.desk_set.get(id=desk_id)
        return True
    except:
        return False
