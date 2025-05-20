from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from backend.database import get_db
from backend.schemas.page_api import PageCreate, PageUpdate
from backend.models.page import Page

page_router = APIRouter(prefix="/api/page", tags=["page"])


@page_router.post("/", response_model=Page)
async def create_page(page: PageCreate, session: Session = Depends(get_db)):
    print(page)
    db_page = Page(content=page.content)
    session.add(db_page)
    session.commit()
    session.refresh(db_page)

    return db_page


@page_router.get("/", response_model=list[Page])
async def get_pages(session: Session = Depends(get_db)):
    pages = session.exec(select(Page)).all()
    return pages


@page_router.get("/{page_id}", response_model=Page)
async def get_page(page_id: int, session: Session = Depends(get_db)):
    page = session.get(Page, page_id)
    if not page:
        raise HTTPException(status_code=404, detail="Page not found")
    return page


@page_router.put("/{page_id}", response_model=Page)
async def update_page(
    page_id: int, page_update: PageUpdate, session: Session = Depends(get_db)
):
    db_page = session.get(Page, page_id)
    if not db_page:
        raise HTTPException(status_code=404, detail="Page not found")

    print(page_update.content)
    if page_update.content is not None:
        db_page.content = page_update.content

    session.commit()
    session.refresh(db_page)
    return db_page

@page_router.delete("/{page_id}", status_code=204)
async def delete_page(page_id: int, session: Session = Depends(get_db)):
    page = session.get(Page, page_id)
    if not page:
        raise HTTPException(status_code=404, detail="Page not found")
    session.delete(page)
    session.commit()
    return {"message": "Page deleted successfully"}
