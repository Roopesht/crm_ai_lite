from fastapi import APIRouter

router = APIRouter()


@router.get("")
def list_interactions():
    return {"message": "List of interactions"}


@router.get("/{interaction_id}")
def get_interaction(interaction_id: int):
    return {"message": f"Interaction {interaction_id}"}


@router.post("")
def create_interaction():
    return {"message": "Interaction created"}


@router.put("/{interaction_id}")
def update_interaction(interaction_id: int):
    return {"message": f"Interaction {interaction_id} updated"}


@router.delete("/{interaction_id}")
def delete_interaction(interaction_id: int):
    return {"message": f"Interaction {interaction_id} deleted"}
