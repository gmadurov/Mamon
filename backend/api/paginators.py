from django.core.paginator import EmptyPage, PageNotAnInteger, Paginator


def paginatePurchases(request, objects, page_size=20, page=1):
    paginator = Paginator(objects, page_size)
    try:
        objects = paginator.page(page)
    except PageNotAnInteger:
        objects = paginator.page(1)
    except EmptyPage:
        objects = paginator.page(paginator.num_pages)
    return objects
